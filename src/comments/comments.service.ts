import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto, userId: string) {
    const art = await this.prisma.art.findUnique({
      where: { id: dto.artId },
    });

    if (!art) throw new NotFoundException('Art not found');

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        artId: dto.artId,
        userId,
      },
    });
  }
}
