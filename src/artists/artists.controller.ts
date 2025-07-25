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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Artists')
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistService: ArtistsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  getAllArtists() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by ID' })
  @ApiParam({ name: 'id', description: 'Artist ID (UUID)' })
  getArtistById(@Param('id') id: string) {
    return this.artistService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get artist by associated user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (UUID)' })
  getArtistByUserId(@Param('userId') userId: string) {
    return this.artistService.findByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new artist entry' })
  @ApiBody({ type: CreateArtistDto })
  createArtist(@Body() body: CreateArtistDto) {
    return this.artistService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update artist information' })
  @ApiParam({ name: 'id', description: 'Artist ID (UUID)' })
  @ApiBody({ type: UpdateArtistDto })
  updateArtist(@Param('id') id: string, @Body() body: UpdateArtistDto) {
    return this.artistService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an artist by ID' })
  @ApiParam({ name: 'id', description: 'Artist ID (UUID)' })
  deleteArtist(@Param('id') id: string) {
    return this.artistService.delete(id);
  }
}
