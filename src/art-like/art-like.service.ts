import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { LikeArtDtoRequest } from './dto/request/like-art.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtLikeService {
  constructor(private readonly prisma: PrismaService) { }

  async likeArt(dto: LikeArtDtoRequest) {
    try {
      return await this.prisma.artLike.create({
        data: {
          userId: dto.userId,
          artId: dto.artId,
        }
      })
    } catch (error) {
      throw new BadRequestException("User already liked this art")
    }
  }

  async unlikeArt(dto: LikeArtDtoRequest) {
    try {
      return await this.prisma.artLike.delete({
        where: {
          userId_artId: {
            userId: dto.userId,
            artId: dto.artId
          }
        }
      })
    } catch (error) {
      throw new BadRequestException("User has not liked this art")
    }
  }

  async checkUserArtLike(userId: string, artId: string): Promise<boolean> {
    const result = await this.prisma.artLike.findUnique({
      where: {
        userId_artId: {
          userId: userId,
          artId: artId
        }
      }
    });

    return !!result; // convert to boolean
  }

  async getArtLikeCount(artId: string): Promise<number> {
    const art = await this.prisma.art.findUnique({
      where: { id: artId },
      select: { likesCount: true }
    });

    return art?.likesCount || 0;
  }

  async getArtLikers(artId: string) {
    return await this.prisma.artLike.findMany({
      where: { artId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          }
        }
      }
    });
  }
}