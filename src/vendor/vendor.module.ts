import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorScheduler } from './vendor.scheduler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { VendorController } from './vendor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor])],
  providers: [VendorService, VendorScheduler],
  controllers: [VendorController],
})
export class VendorModule {}
