import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.createForUser(createArtistDto.userId);
  }

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistsService.findById(id);
  }
}
