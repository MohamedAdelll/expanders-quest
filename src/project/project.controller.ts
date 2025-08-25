// project.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProjectOwnerGuard } from './project-owner.guard';
import { UserRole } from 'src/user/user.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private service: ProjectService) {}

  @Get(':id')
  //   getOne(@Param('id') id: number) {
  getOne() {
    // not implemented
  }

  @Patch(':id')
  @UseGuards(ProjectOwnerGuard)
  //   update(@Param('id') id: number, @Body() body: any) {
  update() {
    // not implemented
  }

  @Delete(':id')
  @UseGuards(ProjectOwnerGuard)
  //   remove(@Param('id') id: number) {
  remove() {
    // return this.service.remove(id);
  }

  @Post()
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  //   create(@Body() body: any) {
  create() {
    // not implemented
  }
}
