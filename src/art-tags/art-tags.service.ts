import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtTagDto } from './dto/create-art-tag.dto';
import { UpdateArtTagDto } from './dto/update-art-tag.dto';

@Injectable()
export class ArtTagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateArtTagDto) {
    return this.prisma.artTag.create({ data: dto });
  }

  async findAll() {
    return this.prisma.artTag.findMany();
  }

  async findOne(id: string) {
    const tag = await this.prisma.artTag.findUnique({
      where: { id }
    });

    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return tag;
  }

  async update(id: string, dto: UpdateArtTagDto) {
    await this.findOne(id); // ensure exists
    return this.prisma.artTag.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.artTag.delete({ where: { id } });
  }

  async assignTagToArt(artId: string, tagId: string) {
    return this.prisma.artToArtTag.create({
      data: {
        artId,
        tagId,
      },
    });
  }

  async removeTagFromArt(artId: string, tagId: string) {
    return this.prisma.artToArtTag.delete({
      where: {
        artId_tagId: {
          artId,
          tagId,
        },
      },
    });
  }
}
