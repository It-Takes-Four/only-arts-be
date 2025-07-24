import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtTagsService } from './art-tags.service';
import { CreateArtTagDto } from './dto/create-art-tag.dto';
import { UpdateArtTagDto } from './dto/update-art-tag.dto';

@Controller('tags')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ArtTagsController {
  constructor(private readonly artTagService: ArtTagsService) {}

  @Get()
  findAll() {
    return this.artTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artTagService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateArtTagDto) {
    return this.artTagService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateArtTagDto) {
    return this.artTagService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artTagService.remove(id);
  }

  @Post(':tagId/assign/:artId')
  assignTag(@Param('tagId') tagId: string, @Param('artId') artId: string) {
    return this.artTagService.assignTagToArt(artId, tagId);
  }

  @Delete(':tagId/remove/:artId')
  unassignTag(@Param('tagId') tagId: string, @Param('artId') artId: string) {
    return this.artTagService.removeTagFromArt(artId, tagId);
  }
}
