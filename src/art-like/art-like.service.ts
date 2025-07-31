import { Injectable, OnModuleInit } from '@nestjs/common';
import { LikeArtDtoRequest } from './dto/request/like-art.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtLikeService {
  constructor(private readonly prisma: PrismaService) { }

  async likeArt(dto: LikeArtDtoRequest) {
    return await this.prisma.$transaction(async (tx) => {
      const existingLike = await tx.artLike.findUnique({
        where: {
          userId_artId: {
            userId: dto.userId,
            artId: dto.artId
          }
        }
      });

      if (existingLike) {
        await tx.artLike.delete({
          where: {
            userId_artId: {
              userId: dto.userId,
              artId: dto.artId
            }
          }
        });

        await tx.art.update({
          where: { id: dto.artId },
          data: { likesCount: { decrement: 1 } }
        });

        return { liked: false, message: 'Art unliked successfully' };
      } else {
        await tx.artLike.create({
          data: {
            userId: dto.userId,
            artId: dto.artId
          }
        });

        await tx.art.update({
          where: { id: dto.artId },
          data: { likesCount: { increment: 1 } }
        });

        return { liked: true, message: 'Art liked successfully' };
      }
    });
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