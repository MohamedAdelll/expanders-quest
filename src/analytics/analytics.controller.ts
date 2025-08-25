// analytics.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('top-vendors')
  async topVendors() {
    return this.analytics.topVendorsPerCountry();
  }
}
