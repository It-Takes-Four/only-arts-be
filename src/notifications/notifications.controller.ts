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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  getAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the notification' })
  getById(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications by user ID' })
  @ApiParam({ name: 'userId', description: 'UUID of the user' })
  getByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get notifications by artist ID' })
  @ApiParam({ name: 'artistId', description: 'UUID of the artist' })
  getByArtist(@Param('artistId') artistId: string) {
    return this.notificationsService.findByArtist(artistId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({ type: CreateNotificationDto })
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing notification' })
  @ApiParam({ name: 'id', description: 'UUID of the notification to update' })
  @ApiBody({ type: UpdateNotificationDto })
  update(@Param('id') id: string, @Body() body: UpdateNotificationDto) {
    return this.notificationsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'UUID of the notification to delete' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
