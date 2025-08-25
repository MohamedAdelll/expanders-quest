import { Module } from '@nestjs/common';
import { ProjectOwnerGuard } from './project-owner.guard';
import { ProjectService } from './project.service';

@Module({
  providers: [ProjectOwnerGuard, ProjectService],
})
export class ProjectModule {}
