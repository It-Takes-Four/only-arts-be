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
import { UpdateCollectionContentDtoRequest } from './dto/request/update-collection-content.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { ArtResource } from 'src/arts/resources/art.resource';
import { CreateArtDtoRequest } from 'src/arts/dto/request/create-art.dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Art Collections')
@Controller('art-collections')
export class ArtCollectionsController {
  constructor(private readonly artCollectionsService: ArtCollectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
        description: { type: 'string', example: 'A curated collection of modern art pieces' },
        price: { type: 'number', example: 100 },
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ 
    summary: 'Get art collections by artistId', 
    description: 'Returns paginated list of collections by artist. If authenticated, includes purchase status for each collection.' 
  })
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
            properties: {
              id: { type: 'string' },
              collectionName: { type: 'string' },
              description: { type: 'string' },
              coverImageFileId: { type: 'string' },
              price: { type: 'string' },
              tokenId: { type: 'string' },
              isPublished: { type: 'boolean' },
              isPurchased: { type: 'boolean', description: 'Whether the current user has purchased this collection (false if not authenticated)' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              artistId: { type: 'string' },
              artist: { type: 'object' },
              artsCount: { type: 'number' },
            },
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
    @Request() req?: AuthenticatedRequest,
  ) {
    const userId = req?.user?.userId;
    const result =
      await this.artCollectionsService.findAllCollectionsByArtistId(
        artistId,
        paginationQuery.page,
        paginationQuery.limit,
        userId,
      );

    return PaginatedResource.make(result, ArtCollectionResource);
  }

  @Get('my/collections')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all arts from all collections of current user',
  })
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
    description: 'Paginated list of arts from user collections',
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
  async findArtsFromMyCollections(
    @Request() req: AuthenticatedRequest,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const result = await this.artCollectionsService.findAllArtsFromUserCollections(
      req.user.userId,
      paginationQuery.page,
      paginationQuery.limit,
    );
    
    // Debug logging to see raw data
    console.log('Raw result from service:');
    console.log(JSON.stringify(result.data?.[0]?.tags, null, 2));
    
    // Transform data manually to avoid PaginatedResource issues
    const transformedData = ArtResource.collection(result.data);
    console.log('Transformed data tags:');
    console.log(JSON.stringify(transformedData?.[0]?.tags, null, 2));
    
    return {
      data: transformedData,
      pagination: {
        currentPage: result.pagination.page,
        perPage: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
        hasNextPage: result.pagination.page < result.pagination.totalPages,
        hasPrevPage: result.pagination.page > 1,
      },
    };
  }

  @Get('my/purchased-collections')
  @UseGuards(JwtAuthGuard)
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
  async findOne(@Param('id') id: string) {
    const arts = await this.artCollectionsService.findArtsInCollection(id);
    return ArtResource.collection(arts);
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

  @Patch(':id/content')
  @ApiOperation({
    summary: 'Update collection name, description, price and/or arts of an unpublished collection',
    description: 'Updates the content of an art collection including name, description, price, and associated artworks. Can only be performed on collections that have not been published yet.'
  })
  @ApiParam({ name: 'id', type: String, description: 'Collection ID' })
  @UseGuards(JwtAuthGuard)
  async updateCollectionContent(
    @Param('id') collectionId: string,
    @Body() body: UpdateCollectionContentDtoRequest,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.artCollectionsService.updateCollectionContent(
      collectionId,
      body,
      req.user.userId,
    );
    return result;
  }

  @Patch(':id/cover-image')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Update art collection cover image (only for unpublished collections)',
    description: 'Updates the cover image of an art collection. Can only be performed on collections that have not been published yet.'
  })
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
  @UseGuards(JwtAuthGuard)
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

  @Post(':id/arts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Create art inside a specific collection (only for unpublished collections)',
    description: 'Creates a new artwork and adds it to the specified collection. Can only be performed on collections that have not been published yet.'
  })
  @ApiParam({ name: 'id', type: String, description: 'Collection ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create artwork with image and metadata for collection',
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
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async createArtInCollection(
    @Param('id') collectionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateArtDtoRequest,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.artCollectionsService.createArtInCollection(
      collectionId,
      body,
      file,
      req.user.userId,
    );
    return ArtResource.make(result);
  }

  @Delete(':id/arts/:artId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Remove art from a specific collection (only for unpublished collections)',
    description: 'Removes an artwork from the specified collection. Can only be performed on collections that have not been published yet. The artwork itself is not deleted, only removed from the collection.'
  })
  @ApiParam({ name: 'id', type: String, description: 'Collection ID' })
  @ApiParam({ name: 'artId', type: String, description: 'Art ID to remove from collection' })
  @ApiResponse({
    status: 200,
    description: 'Successfully removed art from collection',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Art removed from collection successfully' },
      },
    },
  })
  async removeArtFromCollection(
    @Param('id') collectionId: string,
    @Param('artId') artId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.artCollectionsService.removeArtFromCollection(
      collectionId,
      artId,
      req.user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  remove(@Param('id') id: string) {
    return this.artCollectionsService.remove(id);
  }
}
