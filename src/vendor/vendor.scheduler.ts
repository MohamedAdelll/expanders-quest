// vendor.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';

@Injectable()
export class VendorScheduler {
  constructor(private readonly vendorService: VendorService) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON) // every day at noon
  async flagExpiredSLAs() {
    const vendors = (await this.vendorService.findAll()) as Vendor[];
    for (const vendor of vendors) {
      if (vendor.responseSlaHours > 72) {
        vendor.slaExpiredAt = new Date();
        await this.vendorService.updateVendor(vendor.id, vendor);
      }
    }
  }
}
