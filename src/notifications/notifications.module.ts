import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowersService } from 'src/followers/followers.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, FollowersService],
})
export class NotificationsModule {}