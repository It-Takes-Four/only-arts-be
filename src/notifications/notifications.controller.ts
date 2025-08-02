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
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResource } from 'src/common/resources/paginated.resource';
import { NotificationResource } from './resources/notification.resource';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get('my')
  @ApiOperation({ summary: 'Get all notifications from current user' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  async getMyNotifications(
    @Request() req: AuthenticatedRequest,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    const result = await this.notificationsService.findByUser(req.user.userId, paginationQuery.page, paginationQuery.limit);

    return PaginatedResource.make(result, NotificationResource)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the notification' })
  getById(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'UUID of the notification to delete' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
