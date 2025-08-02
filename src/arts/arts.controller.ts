import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { ArtsService } from './arts.service';
import { CreateArtDtoRequest } from './dto/request/create-art.dto';
import { UpdateArtDtoRequest } from './dto/request/update-art.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArtResource } from './resources/art.resource';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResource } from 'src/common/resources/paginated.resource';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Arts')
@Controller('art')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ArtController {
  constructor(private readonly artService: ArtsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all artworks' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of all artworks',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        pagination: {
          type: 'object',
          properties: {
            currentPage: { type: 'number' },
            perPage: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
          },
        },
      },
    },
  })
  async getAllArt(@Query() paginationQuery: PaginationQueryDto) {
    const result = await this.artService.findAll(
      paginationQuery.page,
      paginationQuery.limit,
    );
    return PaginatedResource.make(result, ArtResource);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork' })
  async getMyArts(@Request() req: AuthenticatedRequest,) {
    const art = await this.artService.findByUser(req.user.userId);
    return ArtResource.make(art);
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get all artworks by artist ID' })
  @ApiParam({ name: 'artistId', description: 'UUID of the artist' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of artworks by artist',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        pagination: {
          type: 'object',
          properties: {
            currentPage: { type: 'number' },
            perPage: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
          },
        },
      },
    },
  })
  async getArtByArtist(
    @Param('artistId') artistId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const result = await this.artService.findByArtist(
      artistId,
      paginationQuery.page,
      paginationQuery.limit,
    );
    return PaginatedResource.make(result, ArtResource);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork' })
  async getArtById(@Param('id') id: string, @Request() req?: AuthenticatedRequest,) {
    const art = await this.artService.findById(id, req?.user.userId);
    return ArtResource.make(art);
  }

  @Post()
  @ApiOperation({ summary: 'Create new artwork (with optional tags)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create artwork with image and metadata',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Sungazer' },
        description: { type: 'string', example: 'A surreal sunset over an alien landscape.' },
        tagIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['4e365859-e8d4-4cf7-8091-9acbb7c1dc56'],
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['title', 'description', 'file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  createArt(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateArtDtoRequest,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.artService.createWithTags(body, file, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork to update' })
  @ApiBody({ type: UpdateArtDtoRequest })
  async updateArt(@Param('id') id: string, @Body() body: UpdateArtDtoRequest) {
    const art = await this.artService.updateWithTags(id, body);
    return ArtResource.make(art);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork to delete' })
  async deleteArt(@Param('id') id: string) {
    const art = await this.artService.delete(id);
    return ArtResource.make(art);
  }
}
