import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto, PaginatedSearchQueryDto } from './dto/search-query.dto';

@ApiTags('Search')
@Controller('search')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('arts')
  @ApiOperation({ 
    summary: 'Search for arts that are not in collections (paginated)',
    description: 'Search for individual artworks that are not part of any collection. Results are paginated.'
  })
  async searchArts(@Query() query: PaginatedSearchQueryDto) {
    return this.searchService.searchArts(query.q, Number(query.page), Number(query.limit));
  }

  @Get('collections')
  @ApiOperation({ 
    summary: 'Search for collections (paginated)',
    description: 'Search for published art collections. Results are paginated.'
  })
  async searchCollections(@Query() query: PaginatedSearchQueryDto) {
    return this.searchService.searchCollections(query.q, Number(query.page), Number(query.limit));
  }

  @Get('artists')
  @ApiOperation({ 
    summary: 'Search for artists (paginated)',
    description: 'Search for artists by name, bio, or username. Results are paginated.'
  })
  async searchArtists(@Query() query: PaginatedSearchQueryDto) {
    return this.searchService.searchArtists(query.q, Number(query.page), Number(query.limit));
  }

  @Get()
  @ApiOperation({ 
    summary: 'Search across all categories (not paginated)',
    description: 'Search across arts, collections, and artists. Returns limited results from each category (5 items each).'
  })
  async search(@Query() query: SearchQueryDto) {
    return this.searchService.searchAll(query.q);
  }
}
