// analytics.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectStatus } from 'src/project/project.entity';
import {
  MODEL_NAME as ResearchModelName,
  ResearchDocument,
} from 'src/research/research.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectModel(ResearchModelName)
    private readonly docModel: Model<ResearchDocument>,
  ) {}

  /**
   * Output shape:
   * [
   *   {
   *     countryCode: "US",
   *     topVendors: [
   *       { vendorId: 12, name: "Acme", avgScore: 8.73 },
   *       { vendorId: 5,  name: "Globex", avgScore: 7.90 },
   *       { vendorId: 2,  name: "Beta LLC", avgScore: 7.10 }
   *     ],
   *     researchDocsCount: 42
   *   },
   *   ...
   * ]
   */
  async topVendorsPerCountry() {
    // 1) MySQL: top 3 vendors per country by avg score in last 30 days
    // - matches.created_at in last 30 days
    // - group by country + vendor
    // - rank vendors per country, pick top 3
    const topRows: Array<{
      country_code: string;
      vendor_id: number;
      name: string;
      avg_score: number;
      rn: number;
    }> = await this.dataSource.query(
      `
      SELECT * FROM (
        SELECT
          p.country AS country_code,
          v.id           AS vendor_id,
          v.name         AS name,
          AVG(m.score)   AS avg_score,
          ROW_NUMBER() OVER (
            PARTITION BY p.country
            ORDER BY AVG(m.score) DESC
          ) AS rn
        FROM matches m
        JOIN projects p ON p.id = m.project_id
        JOIN vendors  v ON v.id = m.vendor_id
        WHERE m.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY p.country, v.id, v.name
      ) ranked
      WHERE ranked.rn <= 3
      ORDER BY ranked.country_code, ranked.rn;
      `,
    );
    // [{country_code, vendor_id, name, avg_score, rn}, ...]

    // group into { [countryCode]: [{vendorId, name, avgScore}] }
    const topByCountry = new Map<
      string,
      Array<{ vendorId: number; name: string; avgScore: number }>
    >();
    for (const r of topRows) {
      if (!topByCountry.has(r.country_code)) {
        topByCountry.set(r.country_code, []);
      }
      topByCountry.get(r.country_code)!.push({
        vendorId: r.vendor_id,
        name: r.name,
        avgScore: Number(r.avg_score),
      });
    }

    // 2) Mongo: count research docs per country for ACTIVE projects
    //    - First, get counts per projectId from Mongo
    const docsByProject: Array<{ _id: number; count: number }> =
      await this.docModel.aggregate([
        { $group: { _id: '$projectId', count: { $sum: 1 } } },
      ]);

    const projectIds = docsByProject.map((p) => p._id);
    const countryDocCount = new Map<string, number>(); // country_code -> count

    if (projectIds.length > 0) {
      // 2b) MySQL: map projectId -> country_code ONLY for active projects
      // chunk IN(...) if you’re worried about very large lists
      // (kept simple here)
      const rows: Array<{ id: number; country_code: string }> =
        await this.dataSource.createQueryRunner().manager.query(
          `
        SELECT id, country AS country_code
        FROM projects
        WHERE status = '${ProjectStatus.ACTIVE}' AND id IN ( ${projectIds.map(() => '?').join(', ')} )
        `,
          projectIds,
        );
      // [{id, country_code}, ...] Which are active projects

      // quick lookup map: projectId -> country_code
      const pidToCountry = new Map<number, string>();
      for (const r of rows) pidToCountry.set(r.id, r.country_code);

      // fold doc counts into country totals (only active projects counted)

      for (const { _id: pid, count } of docsByProject) {
        const cc = pidToCountry.get(pid);
        if (!cc) continue; // not active or not found
        countryDocCount.set(cc, (countryDocCount.get(cc) || 0) + count);
      }
    }

    // 3) Merge results:
    // include every country that appears either in topByCountry or in countryDocCount
    const countrySet = new Set<string>([
      ...topByCountry.keys(),
      ...countryDocCount.keys(),
    ]);

    const result = Array.from(countrySet).map((cc) => ({
      countryCode: cc,
      topVendors: topByCountry.get(cc) || [],
      researchDocsCount: countryDocCount.get(cc) ?? 0,
    }));

    // sort by country code for stable output (optional)
    result.sort((a, b) => a.countryCode.localeCompare(b.countryCode));

    return result;
  }
}
