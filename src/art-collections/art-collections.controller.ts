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
} from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { CreateArtCollectionDto } from './dto/request/create-art-collection.dto';
import { UpdateArtCollectionDto } from './dto/request/update-art-collection.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { CreateWithArtsRequest } from './dto/request/create-with-arts.dto';
import { PrepareCollectionPurchaseRequest } from 'src/collection-access/dto/request/prepare-collection-purchase.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Art Collections')
@Controller('art-collections')
export class ArtCollectionsController {
  constructor(private readonly artCollectionsService: ArtCollectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new art collection' })
  @ApiBody({
    type: CreateArtCollectionDto,
    description: 'Payload for creating an art collection',
  })
  create(@Body() createArtCollectionDto: CreateArtCollectionDto) {
    return this.artCollectionsService.create(createArtCollectionDto);
  }

  @Post('/create-with-arts')
  @ApiOperation({ summary: 'Create a new art collection with arts' })
  @ApiBody({
    type: CreateWithArtsRequest,
    description: 'Payload for creating an art collection',
  })
  createWithArts(@Body() createWithArtsRequest: CreateWithArtsRequest) {
    return this.artCollectionsService.createWithArts(createWithArtsRequest);
  }

  @Post('/prepare-collection-purchase')
  @ApiOperation({ summary: 'Returns necessary data for collection purchase transaction' })
  @ApiBody({
    type: PrepareCollectionPurchaseRequest,
    description: 'Payload for returning necessary data for collection purchase',
  })
  prepareCollectionPurchase(@Body() prepareCollectionPurchaseRequest: PrepareCollectionPurchaseRequest) {
    return this.artCollectionsService.prepareCollectionPurchase(prepareCollectionPurchaseRequest);
  }

  @Get()
  @ApiOperation({ summary: 'Get all art collections' })
  findAll() {
    return this.artCollectionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  findOne(@Param('id') id: string) {
    return this.artCollectionsService.findArtsInCollection(id);
  }

  @Get('my/arts')
  @ApiOperation({ summary: 'Get all arts from all collections of current user' })
  findArtsFromMyCollections(@Request() req: AuthenticatedRequest) {
    return this.artCollectionsService.findAllArtsFromUserCollections(req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  @ApiBody({
    type: UpdateArtCollectionDto,
    description: 'Payload for updating an art collection',
  })

  update(
    @Param('id') id: string,
    @Body() updateArtCollectionDto: UpdateArtCollectionDto,
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
