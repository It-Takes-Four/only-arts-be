import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtService } from './arts.service';
import { CreateArtDto } from './dto/create-art.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('arts')
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  @Get()
  findAll() {
    return this.artService.findAll();
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  create(@Body() dto: CreateArtDto, @Req() req) {
    const userId = req.user.sub;
    return this.artService.create(dto, userId);
  }
}
