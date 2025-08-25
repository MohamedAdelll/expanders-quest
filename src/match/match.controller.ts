import { Controller, Param, ParseIntPipe, Get } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('projects/:id/matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('rebuild')
  async rebuildMatches(@Param('id', ParseIntPipe) id: number) {
    return await this.matchService.rebuildMatches(id);
  }
}
