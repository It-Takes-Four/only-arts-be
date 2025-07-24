import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { CreateArtCollectionDto } from './dto/create-art-collection.dto';
import { UpdateArtCollectionDto } from './dto/update-art-collection.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('art-collections')
export class ArtCollectionsController {
  constructor(private readonly artCollectionsService: ArtCollectionsService) {}

  @Post()
  create(@Body() createArtCollectionDto: CreateArtCollectionDto) {
    return this.artCollectionsService.create(createArtCollectionDto);
  }

  @Get()
  findAll() {
    return this.artCollectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artCollectionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtCollectionDto: UpdateArtCollectionDto) {
    return this.artCollectionsService.update(+id, updateArtCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artCollectionsService.remove(+id);
  }
}
