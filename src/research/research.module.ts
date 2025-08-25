import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchSchema, MODEL_NAME } from './research.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MODEL_NAME, schema: ResearchSchema }]),
  ],
  controllers: [ResearchController],
  providers: [ResearchService],
  exports: [MongooseModule],
})
export class ResearchModule {}
