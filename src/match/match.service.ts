import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/project.entity';
import { Vendor } from 'src/vendor/vendor.entity';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    private readonly notificationService: NotificationService,
  ) {}

  async rebuildMatches(projectId: number) {
    // 1. Get project with only the needed fields
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['client'], // For Client Email when finding matches
      select: ['id', 'country'], // FK column
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // 2. Get project services (ids only, from join table)
    const projectServices = await this.projectRepo
      .createQueryBuilder('p')
      .select('ps.service_id', 'id')
      .innerJoin('project_services', 'ps', 'ps.project_id = p.id')
      .where('p.id = :projectId', { projectId })
      .getRawMany<{ id: number }>();

    const projectServiceIds = projectServices.map((s) => s.id);

    if (projectServiceIds.length === 0) {
      return { count: 0, matches: [] };
    }

    // 3. Find vendors that support the same country (filter at SQL level)
    const vendors = await this.vendorRepo
      .createQueryBuilder('v')
      .select(['v.id', 'v.rating', 'v.response_sla_hours'])
      .innerJoin(
        'vendor_countries',
        'vc',
        'vc.vendor_id = v.id AND vc.country_code = :code',
        { code: project.country },
      )
      .getMany();

    const matches: Match[] = [];

    // 4. For each vendor, check service overlap
    for (const vendor of vendors) {
      // Get vendor services (ids only)
      const vendorServices = await this.vendorRepo
        .createQueryBuilder('v')
        .select('vs.service_id', 'id')
        .innerJoin('vendor_services', 'vs', 'vs.vendor_id = v.id')
        .where('v.id = :id', { id: vendor.id })
        .getRawMany<{ id: number }>();

      const vendorServiceIds = vendorServices.map((s) => s.id);

      // overlap
      const overlap = vendorServiceIds.filter((id) =>
        projectServiceIds.includes(id),
      );
      if (overlap.length === 0) continue;

      // Score formula
      const SLA_weight =
        vendor.responseSlaHours <= 24
          ? 2
          : vendor.responseSlaHours <= 72
            ? 1
            : 0;

      const score = overlap.length * 2 + Number(vendor.rating) + SLA_weight;

      // 5. Upsert logic
      let match = await this.matchRepo.findOne({
        where: { project: { id: project.id }, vendor: { id: vendor.id } },
      });

      if (!match) {
        match = this.matchRepo.create({
          project: { id: project.id },
          vendor: { id: vendor.id },
          score,
        });
        this.notificationService.sendMatchEmail(
          project.client.contactEmail,
          project.id,
          score,
        );
      } else {
        match.score = score;
      }

      await this.matchRepo.save(match);
      matches.push(match);
    }

    return { count: matches.length, matches };
  }
}
