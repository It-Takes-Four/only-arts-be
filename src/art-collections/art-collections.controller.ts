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
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { PrepareCollectionPurchaseDtoRequest } from './dto/request/prepare-collection-purchase.dto';
import { CompletePurchaseDtoRequest } from './dto/request/complete-purchase.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Art Collections')
@Controller('art-collections')
export class ArtCollectionsController {
  constructor(private readonly artCollectionsService: ArtCollectionsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new art collection (with optional cover image)' })
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
  @ApiOperation({ summary: 'Returns necessary data for collection purchase transaction' })
  @ApiBody({
    type: PrepareCollectionPurchaseDtoRequest,
    description: 'Payload for returning necessary data for collection purchase',
  })
  prepareCollectionPurchase(@Body() prepareCollectionPurchaseDtoRequest: PrepareCollectionPurchaseDtoRequest) {
    return this.artCollectionsService.prepareCollectionPurchase(prepareCollectionPurchaseDtoRequest);
  }

  @Post('/complete-collection-purchase')
  @ApiOperation({ summary: 'Verify and complete collection purchase transaction' })
  @ApiBody({
    type: CompletePurchaseDtoRequest,
    description: 'Payload for verifying and completing collection purchase',
  })
  completePurchase(@Body() completePurchaseDtoRequest: CompletePurchaseDtoRequest) {
    return this.artCollectionsService.completePurchase(completePurchaseDtoRequest);
  }

  @Get()
  @ApiOperation({ summary: 'Get all art collections' })
  findAll() {
    return this.artCollectionsService.findAll();
  }

  @Get('my/collections')
  @ApiOperation({ summary: 'Get all collections of current user' })
  findAllCollectionsByArtistId(@Request() req: AuthenticatedRequest) {
    return this.artCollectionsService.findAllCollectionsByArtistId(req.user.userId);
  }

  @Get('my/arts')
  @ApiOperation({ summary: 'Get all arts from all collections of current user' })
  findArtsFromMyCollections(@Request() req: AuthenticatedRequest) {
    return this.artCollectionsService.findAllArtsFromUserCollections(req.user.userId);
  }

  @Get('my/purchased-collections')
  @ApiOperation({ summary: 'Get all collections purchased by current user' })
  findPurchasedCollections(@Request() req: AuthenticatedRequest) {
    return this.artCollectionsService.findPurchasedCollections(req.user.userId);
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

  

  @Patch(':id')
  @ApiOperation({ summary: 'Update an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  @ApiBody({
    type: UpdateArtCollectionDtoRequest,
    description: 'Payload for updating an art collection',
  })
  update(
    @Param('id') id: string,
    @Body() updateArtCollectionDto: UpdateArtCollectionDtoRequest,
  ) {
    return this.artCollectionsService.update(id, updateArtCollectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  remove(@Param('id') id: string) {
    return this.artCollectionsService.remove(id);
  }
}
