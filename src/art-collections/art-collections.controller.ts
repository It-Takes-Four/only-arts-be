import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { CreateArtCollectionDtoRequest } from './dto/request/create-art-collection.dto';
import { UpdateArtCollectionDtoRequest } from './dto/request/update-art-collection.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { PrepareCollectionPurchaseDtoRequest } from './dto/request/prepare-collection-purchase.dto';
import { CompletePurchaseDtoRequest } from './dto/request/complete-purchase.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResource } from 'src/common/resources/paginated.resource';
import { ArtCollectionResource } from './resources/art-collection.resource';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Art Collections')
@Controller('art-collections')
export class ArtCollectionsController {
  constructor(private readonly artCollectionsService: ArtCollectionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new art collection (with optional cover image)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Collection metadata and optional cover image',
    schema: {
      type: 'object',
      properties: {
        collectionName: { type: 'string', example: 'Modern Art Showcase' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['collectionName'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateArtCollectionDtoRequest,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.artCollectionsService.create(body, file, req.user.userId);
  }

  @Post('/prepare-collection-purchase')
  @ApiOperation({
    summary: 'Returns necessary data for collection purchase transaction',
  })
  @ApiBody({
    type: PrepareCollectionPurchaseDtoRequest,
    description: 'Payload for returning necessary data for collection purchase',
  })
  prepareCollectionPurchase(
    @Body()
    prepareCollectionPurchaseDtoRequest: PrepareCollectionPurchaseDtoRequest,
  ) {
    return this.artCollectionsService.prepareCollectionPurchase(
      prepareCollectionPurchaseDtoRequest,
    );
  }

  @Post('/complete-collection-purchase')
  @ApiOperation({
    summary: 'Verify and complete collection purchase transaction',
  })
  @ApiBody({
    type: CompletePurchaseDtoRequest,
    description: 'Payload for verifying and completing collection purchase',
  })
  completePurchase(
    @Body() completePurchaseDtoRequest: CompletePurchaseDtoRequest,
  ) {
    return this.artCollectionsService.completePurchase(
      completePurchaseDtoRequest,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all art collections' })
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
    description: 'Paginated list of all published art collections',
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
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const result = await this.artCollectionsService.findAll(
      paginationQuery.page,
      paginationQuery.limit,
    );

    return PaginatedResource.make(result, ArtCollectionResource);
  }

  @Get('/artist/:artistId')
  @ApiOperation({ summary: 'Get art collections by artistId' })
  @ApiParam({ name: 'artistId', type: String, description: 'Artist ID' })
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
    description: 'Paginated list of art collections by artist',
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
  async getCollectionByArtistId(
    @Param('artistId') artistId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const result = await this.artCollectionsService.findAllCollectionsByArtistId(
      artistId,
      paginationQuery.page,
      paginationQuery.limit,
    );

    return PaginatedResource.make(result, ArtCollectionResource);
  }

  @Get('my/collections')
  @ApiOperation({ summary: 'Get all collections of current user' })
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
    description: "Paginated list of user's art collections",
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
  async findAllCollectionsByUserId(
    @Request() req: AuthenticatedRequest,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const result = await this.artCollectionsService.findAllCollectionsByUserId(
      req.user.userId,
      paginationQuery.page,
      paginationQuery.limit,
    );

    return PaginatedResource.make(result, ArtCollectionResource);
  }

  @Get('my/arts')
  @ApiOperation({
    summary: 'Get all arts from all collections of current user',
  })
  findArtsFromMyCollections(@Request() req: AuthenticatedRequest) {
    return this.artCollectionsService.findAllArtsFromUserCollections(
      req.user.userId,
    );
  }

  @Get('my/purchased-collections')
  @ApiOperation({ summary: 'Get all collections purchased by current user' })
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
    description: 'Paginated list of purchased art collections',
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
  async findPurchasedCollections(
    @Request() req: AuthenticatedRequest,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const result = await this.artCollectionsService.findPurchasedCollections(
      req.user.userId,
      paginationQuery.page,
      paginationQuery.limit,
    );

    return PaginatedResource.make(result, ArtCollectionResource);
  }

  @Get(':id/arts')
  @ApiOperation({ summary: 'Get arts inside an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  findOne(@Param('id') id: string) {
    return this.artCollectionsService.findArtsInCollection(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  @ApiResponse({
    status: 200,
    description: 'Art collection details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        collectionName: { type: 'string' },
        description: { type: 'string' },
        coverImageFileId: { type: 'string' },
        price: { type: 'string' },
        tokenId: { type: 'string' },
        isPublished: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        artistId: { type: 'string' },
        artist: { type: 'object' },
        artsCount: { type: 'number' },
      },
    },
  })
  async getCollectionById(@Param('id') id: string) {
    const result = await this.artCollectionsService.findOne(id);
    if (!result) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
    return ArtCollectionResource.make(result);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update art collection name and description' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  @ApiBody({
    type: UpdateArtCollectionDtoRequest,
    description: 'Payload for updating collection name and description',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated art collection',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        collectionName: { type: 'string' },
        description: { type: 'string' },
        coverImageFileId: { type: 'string' },
        price: { type: 'string' },
        tokenId: { type: 'string' },
        isPublished: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        artistId: { type: 'string' },
        artist: { type: 'object' },
        artsCount: { type: 'number' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateArtCollectionDto: UpdateArtCollectionDtoRequest,
  ) {
    const result = await this.artCollectionsService.update(id, updateArtCollectionDto);
    return ArtCollectionResource.make(result);
  }

  @Patch(':id/cover-image')
  @ApiOperation({ summary: 'Update art collection cover image' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Cover image file',
    schema: {
      type: 'object',
      properties: {
        coverImage: {
          type: 'string',
          format: 'binary',
          description: 'Cover image file (JPEG, PNG, GIF, WebP - max 10MB)',
        },
      },
      required: ['coverImage'],
    },
  })
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async updateCoverImage(
    @Param('id') id: string,
    @UploadedFile() coverImage: Express.Multer.File,
  ) {
    if (!coverImage) {
      throw new BadRequestException('Cover image file is required');
    }

    const result = await this.artCollectionsService.updateCoverImage(id, coverImage);
    return ArtCollectionResource.make(result);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish an art collection (irreversible)' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully published art collection',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        collectionName: { type: 'string' },
        description: { type: 'string' },
        coverImageFileId: { type: 'string' },
        price: { type: 'string' },
        tokenId: { type: 'string' },
        isPublished: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        artistId: { type: 'string' },
        artist: { type: 'object' },
        artsCount: { type: 'number' },
      },
    },
  })
  async publish(@Param('id') id: string) {
    const result = await this.artCollectionsService.publish(id);
    return ArtCollectionResource.make(result);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  remove(@Param('id') id: string) {
    return this.artCollectionsService.remove(id);
  }
}
