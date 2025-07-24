import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artists')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ArtistsController {
  constructor(private readonly artistService: ArtistsService) {}

  @Get()
  getAllArtists() {
    return this.artistService.findAll();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string) {
    return this.artistService.findById(id);
  }

  @Get('user/:userId')
  getArtistByUserId(@Param('userId') userId: string) {
    return this.artistService.findByUserId(userId);
  }

  @Post()
  createArtist(@Body() body: CreateArtistDto) {
    return this.artistService.create(body);
  }

  @Patch(':id')
  updateArtist(@Param('id') id: string, @Body() body: UpdateArtistDto) {
    return this.artistService.update(id, body);
  }

  @Delete(':id')
  deleteArtist(@Param('id') id: string) {
    return this.artistService.delete(id);
  }
}
