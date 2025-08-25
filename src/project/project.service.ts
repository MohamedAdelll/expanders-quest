import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from './project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}
  async getActiveProjects() {
    return await this.projectRepo.find({
      where: { status: ProjectStatus.ACTIVE },
    });
  }
}
