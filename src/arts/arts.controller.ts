import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArtService } from './arts.service';
import { Art } from './entities/art.entity';

@Controller('arts')
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  @Get()
  findAll(): Promise<Art[]> {
    return this.artService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.artService.create(body);
  }
}
