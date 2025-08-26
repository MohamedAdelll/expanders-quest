import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as
      | { id: number; role: 'admin' | 'client' }
      | undefined;
    if (!user) return false;
    const projectId = Number(req.params.id || req.params.projectId);
    if (!projectId) return false;

    const p = await this.projectService.findByIdWithClient(projectId);

    if (!p) return false;

    const clientId = p.client.id;
    return clientId === user.id;
  }
}
