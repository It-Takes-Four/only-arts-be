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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  getAll(@Query() pagination: PaginationQueryDto) {
    return this.feedsService.findAll(pagination);
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
