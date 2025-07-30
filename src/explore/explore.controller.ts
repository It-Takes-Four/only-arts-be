import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ExploreService } from './explore.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExploreQueryDto } from './dto/explore-query.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Explore')
@Controller('explore')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated artwork for exploration' })
  @ApiResponse({
    status: 200,
    description: 'Artwork retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              imageFileId: { type: 'string' },
              datePosted: { type: 'string', format: 'date-time' },
              likesCount: { type: 'number' },
              isInACollection: { type: 'boolean' },
              artistId: { type: 'string' },
              artistName: { type: 'string' },
              artistProfileFileId: { type: 'string', nullable: true },
              tags: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    tagName: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  getAll(@Query() query: ExploreQueryDto) {
    return this.exploreService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork' })
  @ApiResponse({
    status: 200,
    description: 'Artwork retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Artwork not found',
  })
  async getById(@Param('id') id: string) {
    const artwork = await this.exploreService.findById(id);
    if (!artwork) {
      throw new NotFoundException(`Artwork with ID ${id} not found`);
    }
    return artwork;
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get artwork by artist ID' })
  @ApiParam({ name: 'artistId', description: 'UUID of the artist' })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Page number (default: 1)', 
    example: 1 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Number of items per page (default: 20)', 
    example: 20 
  })
  @ApiResponse({
    status: 200,
    description: 'Artist artwork retrieved successfully',
  })
  getByArtist(
    @Param('artistId') artistId: string,
    @Query() pagination: { page?: number; limit?: number },
  ) {
    return this.exploreService.findByArtist(artistId, pagination);
  }
}
