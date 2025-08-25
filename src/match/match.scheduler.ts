import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchService } from './match.service';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class MatchScheduler {
  private readonly logger = new Logger(MatchScheduler.name);

  constructor(
    private readonly matchService: MatchService,
    private readonly projectService: ProjectService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON) // every day at noon
  async refreshMatches() {
    this.logger.log('Refreshing matches for active projects...');

    const projects = await this.projectService.getActiveProjects();

    for (const project of projects) {
      await this.matchService.rebuildMatches(project.id);
    }
  }
}
