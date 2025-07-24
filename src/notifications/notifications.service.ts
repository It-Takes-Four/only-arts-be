import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: { select: { id: true, username: true } },
        artist: {
          select: { id: true, user: { select: { username: true } } },
        },
      },
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async update(id: string, dto: UpdateNotificationDto) {
    await this.findOne(id); 
    return this.prisma.notification.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.notification.delete({ where: { id } });
  }

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByArtist(artistId: string) {
    return this.prisma.notification.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
