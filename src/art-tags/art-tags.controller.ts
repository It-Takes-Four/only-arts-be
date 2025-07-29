import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtTagsService } from './art-tags.service';
import { CreateArtTagDto } from './dto/create-art-tag.dto';
import { UpdateArtTagDto } from './dto/update-art-tag.dto';
import { PopularTagsQueryDto } from './dto/popular-tags-query.dto';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Art Tags')
@Controller('tags')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ArtTagsController {
  constructor(private readonly artTagService: ArtTagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all art tags' })
  findAll() {
    return this.artTagService.findAll();
  }

  @Get('popular')
  @ApiOperation({ 
    summary: 'Get popular art tags ordered by usage count',
    description: 'Returns the most popular tags based on how many times they are used in art pieces. Supports search filtering by tag name.'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Maximum number of tags to return (1-100)', 
    example: 10 
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Search for tags by name (case-insensitive partial match)', 
    example: 'abstract' 
  })
  findPopular(@Query() query: PopularTagsQueryDto) {
    return this.artTagService.findPopularTags(query.limit, query.search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single art tag by ID' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  findOne(@Param('id') id: string) {
    return this.artTagService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new art tag' })
  @ApiBody({ type: CreateArtTagDto })
  create(@Body() body: CreateArtTagDto) {
    return this.artTagService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing art tag' })
  @ApiParam({ name: 'id', description: 'Tag ID to update' })
  @ApiBody({ type: UpdateArtTagDto })
  update(@Param('id') id: string, @Body() body: UpdateArtTagDto) {
    return this.artTagService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an art tag' })
  @ApiParam({ name: 'id', description: 'Tag ID to delete' })
  remove(@Param('id') id: string) {
    return this.artTagService.remove(id);
  }

  @Post(':tagId/assign/:artId')
  @ApiOperation({ summary: 'Assign a tag to an art piece' })
  @ApiParam({ name: 'tagId', description: 'Tag ID' })
  @ApiParam({ name: 'artId', description: 'Art ID' })
  assignTag(@Param('tagId') tagId: string, @Param('artId') artId: string) {
    return this.artTagService.assignTagToArt(artId, tagId);
  }

  @Delete(':tagId/remove/:artId')
  @ApiOperation({ summary: 'Remove a tag from an art piece' })
  @ApiParam({ name: 'tagId', description: 'Tag ID' })
  @ApiParam({ name: 'artId', description: 'Art ID' })
  unassignTag(@Param('tagId') tagId: string, @Param('artId') artId: string) {
    return this.artTagService.removeTagFromArt(artId, tagId);
  }
}
