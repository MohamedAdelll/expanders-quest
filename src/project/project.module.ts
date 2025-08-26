import { Module } from '@nestjs/common';
import { ProjectOwnerGuard } from './project-owner.guard';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectOwnerGuard, ProjectService],
  exports: [ProjectService, ProjectOwnerGuard],
})
export class ProjectModule {}
