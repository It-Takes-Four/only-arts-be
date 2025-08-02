import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SendNotificationsToUserFollowerRequestDto } from './dto/request/send-notifications-to-user-follower.dto';
import { FollowersService } from 'src/followers/followers.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService, private readonly followersService: FollowersService) { }

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        message: dto.message,
        userId: dto.userId,
      },
    });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePictureFileId: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(id: string, dto: UpdateNotificationDto) {
    await this.findOne(id); // to trigger 404 if not found
    return this.prisma.notification.update({
      where: { id },
      data: {
        message: dto.message,
        userId: dto.userId,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async sendNotificationsToUserFollower(dto: SendNotificationsToUserFollowerRequestDto) {
    const result = await this.prisma.artist.findFirst({
      where: {
        userId: dto.userId
      },
      select: {
        id: true
      }
    })

    if (!result || !result?.id) {
      throw new BadRequestException("Failed to get artistId of current user")
    }

    const followers = await this.followersService.findByArtist(result.id)

    if (!followers.length) return;

    const data = followers.map((follower) => ({
      userId: follower.userId,
      message: dto.message,
      notificationType: dto.notificationType,
      notificationItemId: dto.notificationItemId
    }));

    await this.prisma.notification.createMany({
      data,
    });
  }
}
