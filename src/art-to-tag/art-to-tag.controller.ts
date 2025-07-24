import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtToTagService } from './art-to-tag.service';
import { CreateArtToArtTagDto } from './dto/create-art-to-tag.dto';

@Controller('art-tags')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ArtToTagController {
  constructor(private readonly service: ArtToTagService) {}

  @Post()
  create(@Body() dto: CreateArtToArtTagDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('art/:artId')
  findTagsByArt(@Param('artId') artId: string) {
    return this.service.findTagsByArt(artId);
  }

  @Get('tag/:tagId')
  findArtsByTag(@Param('tagId') tagId: string) {
    return this.service.findArtsByTag(tagId);
  }

  @Delete(':artId/:tagId')
  remove(@Param('artId') artId: string, @Param('tagId') tagId: string) {
    return this.service.remove(artId, tagId);
  }
}
