import { Injectable } from '@nestjs/common';
import { CreateResearchDto } from './dto/createResearch';
import { InjectModel } from '@nestjs/mongoose';
import { MODEL_NAME, ResearchDocument } from './research.schema';
import { Model } from 'mongoose';

@Injectable()
export class ResearchService {
  constructor(
    @InjectModel(MODEL_NAME) private researchModel: Model<ResearchDocument>,
  ) {}
  async create(createResearchDto: CreateResearchDto) {
    const createdResearch = new this.researchModel(createResearchDto);
    return await createdResearch.save();
  }

  async query(tag?: string[], text?: string, project?: number) {
    const filter: Record<string, any> = {};

    if (tag) {
      filter.tags = { $all: tag };
    }
    if (text) {
      filter.$or = [
        { title: { $regex: text, $options: 'i' } },
        { content: { $regex: text, $options: 'i' } },
      ];
    }
    if (project) {
      filter.projectId = project;
    }

    return await this.researchModel.find(filter);
  }
}
