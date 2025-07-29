import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FeedsQueryDto } from './dto/feeds-query.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Feeds')
@Controller('feeds')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated feed posts' })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Page number (default: 1)', 
    example: 1 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Number of items per page (default: 10)', 
    example: 10 
  })
  @ApiQuery({ 
    name: 'tagId', 
    required: false, 
    description: 'Filter feeds by a specific tag ID', 
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111' 
  })
  getAll(@Query() query: FeedsQueryDto) {
    return this.feedsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feed post by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the feed post' })
  getById(@Param('id') id: string) {
    return this.feedsService.findOne(id);
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get paginated feeds by artist ID' })
  getByArtist(
    @Param('artistId') artistId: string,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.feedsService.findByArtist(artistId, pagination);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a new feed post' })
  @ApiBody({ type: CreateFeedDto })
  create(@Body() body: CreateFeedDto) {
    return this.feedsService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing feed post' })
  @ApiParam({ name: 'id', description: 'UUID of the feed post to update' })
  @ApiBody({ type: UpdateFeedDto })
  update(@Param('id') id: string, @Body() body: UpdateFeedDto) {
    return this.feedsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feed post by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the feed post to delete' })
  remove(@Param('id') id: string) {
    return this.feedsService.remove(id);
  }
}
