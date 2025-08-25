import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateResearchDto } from './dto/CreateResearch';
import { ResearchService } from './research.service';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Post()
  async create(@Body() createResearchDto: CreateResearchDto) {
    return await this.researchService.create(createResearchDto);
  }

  @Get()
  async findAll(
    @Query(
      'tag',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    tag: string[],
    @Query('text') text: string,
    @Query('project', new ParseIntPipe({ optional: true })) project: number,
  ) {
    return await this.researchService.query(tag, text, project);
  }
}
