import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtToTagDto } from './dto/create-art-to-tag.dto';
import { UpdateArtToTagDto } from './dto/update-art-to-tag.dto';

@Injectable()
export class ArtToTagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateArtToTagDto) {
    return this.prisma.artToArtTag.create({
      data: {
        artId: dto.artId,
        tagId: dto.tagId,
      },
    });
  }

  async findAll() {
    return this.prisma.artToArtTag.findMany({
      include: {
        art: true,
        tag: true,
      },
    });
  }

  async findTagsByArt(artId: string) {
    return this.prisma.artToArtTag.findMany({
      where: { artId },
      include: { tag: true },
    });
  }

  async findArtsByTag(tagId: string) {
    return this.prisma.artToArtTag.findMany({
      where: { tagId },
      include: { art: true },
    });
  }

  async remove(artId: string, tagId: string) {
    return this.prisma.artToArtTag.delete({
      where: {
        artId_tagId: {
          artId,
          tagId,
        },
      },
    });
  }

  async update(
    originalArtId: string,
    originalTagId: string,
    dto: UpdateArtToTagDto,
  ) {
    await this.prisma.artToArtTag.delete({
      where: {
        artId_tagId: {
          artId: originalArtId,
          tagId: originalTagId,
        },
      },
    });

    return this.prisma.artToArtTag.create({
      data: {
        artId: dto.artId ?? originalArtId,
        tagId: dto.tagId ?? originalTagId,
      },
    });
  }
}
