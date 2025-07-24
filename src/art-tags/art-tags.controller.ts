import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtTagsService } from './art-tags.service';
import { CreateArtTagDto } from './dto/create-art-tag.dto';
import { UpdateArtTagDto } from './dto/update-art-tag.dto';

@Controller('art-tags')
export class ArtTagsController {
  constructor(private readonly artTagsService: ArtTagsService) {}

  @Post()
  create(@Body() createArtTagDto: CreateArtTagDto) {
    return this.artTagsService.create(createArtTagDto);
  }

  @Get()
  findAll() {
    return this.artTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtTagDto: UpdateArtTagDto) {
    return this.artTagsService.update(+id, updateArtTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artTagsService.remove(+id);
  }
}
