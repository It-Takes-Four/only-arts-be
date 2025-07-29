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

  async findAll(pagination: { page?: number; limit?: number; tagId?: string }) {
    const { page = 1, limit = 10, tagId } = pagination;

    // Build the where clause for tag filtering
    const whereClause = tagId
      ? {
          artist: {
            arts: {
              some: {
                tags: {
                  some: {
                    tagId: tagId,
                  },
                },
              },
            },
          },
        }
      : {};

    const [feeds, total] = await Promise.all([
      this.prisma.feed.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          artist: {
            select: {
              id: true,
              user: { select: { username: true, profilePicture: true } },
            },
          },
        },
        orderBy: { datePosted: 'desc' },
      }),
      this.prisma.feed.count({ where: whereClause }),
    ]);

    return {
      data: feeds,
      total,
      page,
      limit,
    };
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
    await this.findOne(id); 
    return this.prisma.feed.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.feed.delete({ where: { id } });
  }

  async findByArtist(
    artistId: string,
    pagination: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 10 } = pagination;

    const [feeds, total] = await Promise.all([
      this.prisma.feed.findMany({
        where: { artistId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { datePosted: 'desc' },
      }),
      this.prisma.feed.count({ where: { artistId } }),
    ]);

    return {
      data: feeds,
      total,
      page,
      limit,
    };
  }
}
