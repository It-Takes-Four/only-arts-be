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
  HttpCode,
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
    const result =
      await this.artCollectionsService.findAllCollectionsByArtistId(
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
  getCollectionById(@Param('id') id: string) {
    return this.artCollectionsService.findOne(id);
  }

  @Patch(':id/content')
  @ApiOperation({
    summary: 'Update price and/or arts of an unpublished collection',
  })
  @ApiParam({ name: 'id', type: String, description: 'Collection ID' })
  @UseGuards(JwtAuthGuard)
  updateCollectionContent(
    @Param('id') collectionId: string,
    @Body() body: UpdateCollectionContentDtoRequest,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.artCollectionsService.updateCollectionContent(
      collectionId,
      body,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  remove(@Param('id') id: string) {
    return this.artCollectionsService.remove(id);
  }
}
