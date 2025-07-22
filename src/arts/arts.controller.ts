import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArtService } from './arts.service';
import { Art } from './entities/art.entity';
import { CreateArtDto } from './dto/create-art.dto';

@Controller('arts')
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  @Get()
  findAll(): Promise<Art[]> {
    return this.artService.findAll();
  }

  @Post(':userId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Param('userId') userId: number, @Body() body: CreateArtDto): Promise<Art> {
    return this.artService.create(body, userId);
  }
}
