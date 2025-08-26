import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ResearchService } from './research.service';
import { CreateResearchDto } from './dto/createResearch';
import { GetResearchFilterDto } from './dto/get-research-filter';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Post()
  async create(@Body() createResearchDto: CreateResearchDto) {
    return await this.researchService.create(createResearchDto);
  }

  @Get()
  async findAll(@Query() getResearchFilter: GetResearchFilterDto) {
    const { tag, text, project } = getResearchFilter;
    return await this.researchService.query(tag, text, project);
  }
}
