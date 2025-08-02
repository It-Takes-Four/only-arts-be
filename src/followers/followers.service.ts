import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';

@Injectable()
export class FollowersService {
  constructor(private readonly prisma: PrismaService) { }

  async follow(userId: string, artistId: string) {
    if (userId === artistId) {
      throw new ConflictException("You can't follow yourself");
    }

    const [existingFollow, artistExists] = await Promise.all([
      this.prisma.follower.findFirst({ where: { userId, artistId } }),
      this.prisma.artist.findUnique({ where: { id: artistId } }),
    ]);

    if (!artistExists) {
      throw new NotFoundException('Artist not found');
    }

    if (existingFollow) {
      throw new ConflictException('You already follow this artist');
    }

    return this.prisma.follower.create({
      data: { userId, artistId },
    });
  }

  async unfollow(userId: string, artistId: string) {
    const existingFollow = await this.prisma.follower.findFirst({
      where: { userId, artistId },
    });

    if (!existingFollow) {
      throw new NotFoundException('Follow relationship not found');
    }

    return this.prisma.follower.delete({
      where: { id: existingFollow.id },
    });
  }

  async isFollowing(userId: string, artistId: string) {
    const result = await this.prisma.follower.findFirst({
      where:{
        userId: userId,
        artistId: artistId
      }
    })

    return !!result
  }

  findAll() {
    return this.prisma.follower.findMany({
      include: {
        user: {
          select: { id: true, username: true, profilePictureFileId: true },
        },
        artist: {
          select: {
            id: true,
            user: {
              select: { username: true, profilePictureFileId: true },
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

    if (!follow)
      throw new NotFoundException(`Follower with ID ${id} not found`);
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
    if (!follow)
      throw new NotFoundException(`Follower with ID ${id} not found`);
    return follow;
  }

  update(id: string, dto: UpdateFollowerDto) {
    return this.prisma.follower.update({
      where: { id },
      data: dto,
    });
  }
}
