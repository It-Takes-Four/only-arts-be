import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';

@Injectable()
export class FollowersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFollowerDto, userId: string) {
    const existing = await this.prisma.follower.findFirst({
      where: {
        userId,
        artistId: dto.artistId,
      },
    });

    if (existing) {
      throw new ConflictException('You already follow this artist');
    }

    return this.prisma.follower.create({
      data: {
        userId,
        artistId: dto.artistId,
      },
    });
  }

  findAll() {
    return this.prisma.follower.findMany({
      include: {
        user: {
          select: { id: true, username: true, profilePicture: true },
        },
        artist: {
          select: {
            id: true,
            user: {
              select: { username: true, profilePicture: true },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    const follow = await this.prisma.follower.findUnique({
      where: { id },
      include: { user: true, artist: true },
    });

    if (!follow) throw new NotFoundException(`Follower with ID ${id} not found`);
    return follow;
  }

  async findByUser(userId: string) {
    return this.prisma.follower.findMany({
      where: { userId },
      include: { artist: true },
    });
  }

  async findByArtist(artistId: string) {
    return this.prisma.follower.findMany({
      where: { artistId },
      include: { user: true },
    });
  }

  async findOne(id: string) {
    const follow = await this.prisma.follower.findUnique({ where: { id } });
    if (!follow) throw new NotFoundException(`Follower with ID ${id} not found`);
    return follow;
  }

  async remove(id: string) {
    await this.findOne(id); 
    return this.prisma.follower.delete({ where: { id } });
  }

  update(id: string, dto: UpdateFollowerDto) {
    return this.prisma.follower.update({
      where: { id },
      data: dto,
    });
  }
}
