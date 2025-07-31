import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20'
  ) {
    return this.searchService.search(query, Number(page), Number(limit));
  }
}
