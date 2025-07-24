import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feeds')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  getAll() {
    return this.feedsService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.feedsService.findOne(id);
  }

  @Get('artist/:artistId')
  getByArtist(@Param('artistId') artistId: string) {
    return this.feedsService.findByArtist(artistId);
  }

  @Post()
  create(@Body() body: CreateFeedDto) {
    return this.feedsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateFeedDto) {
    return this.feedsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedsService.remove(id);
  }
}
