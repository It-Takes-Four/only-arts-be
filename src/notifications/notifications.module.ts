import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowersService } from 'src/followers/followers.service';
import { FollowersModule } from 'src/followers/followers.module';

@Module({
  imports: [FollowersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
  exports: [NotificationsService],
})
export class NotificationsModule { }