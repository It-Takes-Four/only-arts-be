import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtsService } from './arts.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';

@Controller('art')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ArtController {
  constructor(private readonly artService: ArtsService) {}

  @Get()
  getAllArt() {
    return this.artService.findAll();
  }

  @Get(':id')
  getArtById(@Param('id') id: string) {
    return this.artService.findById(id);
  }

  @Get('artist/:artistId')
  getArtByArtist(@Param('artistId') artistId: string) {
    return this.artService.findByArtist(artistId);
  }

  @Post()
  createArt(@Body() body: CreateArtDto) {
    return this.artService.createWithTags(body);
  }

  @Patch(':id')
  updateArt(@Param('id') id: string, @Body() body: UpdateArtDto) {
    return this.artService.updateWithTags(id, body);
  }

  @Delete(':id')
  deleteArt(@Param('id') id: string) {
    return this.artService.delete(id);
  }
}
