import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.comment.findMany({
      include: { user: true, art: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { user: true, art: true },
    });

    if (!comment) throw new NotFoundException(`Comment with ID ${id} not found`);
    return comment;
  }

  async findByArt(artId: string) {
    return this.prisma.comment.findMany({
      where: { artId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.comment.findMany({
      where: { userId },
      include: { art: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: dto,
      include: { user: true, art: true },
    });
  }

  async update(id: string, dto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: dto,
      include: { user: true, art: true },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.comment.delete({ where: { id } });
  }
}
