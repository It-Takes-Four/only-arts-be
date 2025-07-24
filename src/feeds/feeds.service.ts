import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedDto) {
    return this.prisma.feed.create({ data: dto });
  }

  async findAll() {
    return this.prisma.feed.findMany({
      include: {
        artist: {
          select: {
            id: true,
            user: { select: { username: true, profilePicture: true } },
          },
        },
      },
      orderBy: { datePosted: 'desc' },
    });
  }

  async findOne(id: string) {
    const feed = await this.prisma.feed.findUnique({
      where: { id },
      include: {
        artist: {
          select: {
            id: true,
            user: { select: { username: true } },
          },
        },
      },
    });
    if (!feed) throw new NotFoundException(`Feed with ID ${id} not found`);
    return feed;
  }

  async update(id: string, dto: UpdateFeedDto) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.feed.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.feed.delete({ where: { id } });
  }

  async findByArtist(artistId: string) {
    return this.prisma.feed.findMany({
      where: { artistId },
      orderBy: { datePosted: 'desc' },
    });
  }
}
