import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtToTagService } from './art-to-tag.service';
import { UpdateArtToTagDto } from './dto/update-art-to-tag.dto';
import { CreateArtToArtTagDto } from './dto/create-art-to-tag.dto';

@Controller('art-to-tag')
export class ArtToTagController {
  constructor(private readonly artToTagService: ArtToTagService) {}

  @Post()
  create(@Body() createArtToTagDto: CreateArtToArtTagDto) {
    return this.artToTagService.create(createArtToTagDto);
  }

  @Get()
  findAll() {
    return this.artToTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artToTagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtToTagDto: UpdateArtToTagDto) {
    return this.artToTagService.update(+id, updateArtToTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artToTagService.remove(+id);
  }
}
