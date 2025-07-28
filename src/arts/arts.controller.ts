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
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ArtsService } from './arts.service';
import { CreateArtDtoRequest } from './dto/request/create-art.dto';
import { UpdateArtDtoRequest } from './dto/request/update-art.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Arts')
@Controller('art')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ArtController {
  constructor(private readonly artService: ArtsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artworks' })
  getAllArt() {
    return this.artService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork' })
  getArtById(@Param('id') id: string) {
    return this.artService.findById(id);
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get all artworks by artist ID' })
  @ApiParam({ name: 'artistId', description: 'UUID of the artist' })
  getArtByArtist(@Param('artistId') artistId: string) {
    return this.artService.findByArtist(artistId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new artwork (with optional tags)' })
  @ApiBody({ type: CreateArtDtoRequest })
  createArt(@Body() body: CreateArtDtoRequest) {
    return this.artService.createWithTags(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork to update' })
  @ApiBody({ type: UpdateArtDtoRequest })
  updateArt(@Param('id') id: string, @Body() body: UpdateArtDtoRequest) {
    return this.artService.updateWithTags(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork to delete' })
  deleteArt(@Param('id') id: string) {
    return this.artService.delete(id);
  }
}
