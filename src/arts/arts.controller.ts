import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { ArtService } from './arts.service';
import { Art } from './entities/art.entity';
import { CreateArtDto } from './dto/create-art.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('arts')
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  @Get()
  findAll(): Promise<Art[]> {
    return this.artService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateArtDto, @Req() req) {
    const userId = req.user.sub;
    return this.artService.create(dto, userId);
  }
}
