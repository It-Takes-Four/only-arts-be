import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedDto, artistId: string) {
    return this.prisma.feed.create({
      data: {
        title: dto.title,
        content: dto.content,
        artistId,
      },
    });
  }

  async findAll() {
    return this.prisma.feed.findMany({
      include: { artist: true },
    });
  }

  async findOne(id: string) {
    const feed = await this.prisma.feed.findUnique({
      where: { id },
      include: { artist: true },
    });
    if (!feed) throw new NotFoundException('Feed not found');
    return feed;
  }

  async update(id: string, dto: UpdateFeedDto) {
    return this.prisma.feed.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.feed.delete({
      where: { id },
    });
  }
}
