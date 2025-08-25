// vendor.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/user/user.entity';

@Controller('vendor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class VendorController {
  constructor(private service: VendorService) {}

  @Get()
  list() {
    return this.service.findAll();
  }

  @Post()
  //   create(@Body() body: any) {
  create() {
    // creation not implemented
  }

  @Patch(':id')
  //   update(@Param('id') id: number, @Body() body: any) {
  update() {
    // update not implemented
  }

  @Delete(':id')
  //   remove(@Param('id') id: number) {
  remove() {
    // deletion not implemented
  }
}
