import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Project) private projects: Repository<Project>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as
      | { id: number; role: 'admin' | 'client' }
      | undefined;
    if (!user) return false;
    const projectId = Number(req.params.id || req.params.projectId);
    if (!projectId) return false;

    const p = await this.projects.findOne({
      where: { id: projectId },
      select: ['id', 'client'],
      relations: ['client'],
    });

    if (!p) return false;

    const clientId = p.client.id;
    return clientId === user.id;
  }
}
