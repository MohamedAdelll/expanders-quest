import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchScheduler } from './match.scheduler';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { ProjectService } from 'src/project/project.service';
import { Project } from 'src/project/project.entity';
import { Service } from 'src/service/service.entity';
import { NotificationService } from 'src/notification/notification.service';
import { VendorService } from 'src/vendor/vendor.service';
import { Vendor } from 'src/vendor/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Project, Service, Vendor])],
  controllers: [MatchController],
  providers: [
    MatchScheduler,
    MatchService,
    ProjectService,
    NotificationService,
    VendorService,
  ],
})
export class MatchModule {}
