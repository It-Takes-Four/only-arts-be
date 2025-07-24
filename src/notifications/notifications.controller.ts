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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Get('user/:userId')
  getByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get('artist/:artistId')
  getByArtist(@Param('artistId') artistId: string) {
    return this.notificationsService.findByArtist(artistId);
  }

  @Post()
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateNotificationDto) {
    return this.notificationsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
