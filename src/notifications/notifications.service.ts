import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateNotificationDto, userId: string) {
    return this.prisma.notification.create({
      data: {
        content: dto.content,
        userId,
      },
    });
  }

  findAll() {
    return this.prisma.notification.findMany();
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
