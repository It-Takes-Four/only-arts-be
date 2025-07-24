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
import { ArtToTagService } from './art-to-tag.service';
import { CreateArtToArtTagDto } from './dto/create-art-to-tag.dto';
import { UpdateArtToTagDto } from './dto/update-art-to-tag.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('art-to-tag')
export class ArtToTagController {
  constructor(private readonly artToTagService: ArtToTagService) {}

  @Post()
  create(@Body() dto: CreateArtToArtTagDto) {
    return this.artToTagService.create(dto);
  }

  @Get()
  findAll() {
    return this.artToTagService.findAll();
  }

  @Get(':artId/:tagId')
  findOne(
    @Param('artId') artId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.artToTagService.findOne({ artId, tagId });
  }

  @Patch(':artId/:tagId')
  update(
    @Param('artId') artId: string,
    @Param('tagId') tagId: string,
    @Body() dto: UpdateArtToTagDto,
  ) {
    return this.artToTagService.update({ artId, tagId }, dto);
  }

  @Delete(':artId/:tagId')
  remove(
    @Param('artId') artId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.artToTagService.remove({ artId, tagId });
  }
}