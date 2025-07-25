import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { CreateArtCollectionDto } from './dto/create-art-collection.dto';
import { UpdateArtCollectionDto } from './dto/update-art-collection.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

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

  @Get()
  @ApiOperation({ summary: 'Get all art collections' })
  findAll() {
    return this.artCollectionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an art collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Art collection ID' })
  findOne(@Param('id') id: string) {
    return this.artCollectionsService.findOne(id);
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
