import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtTagDto } from './dto/create-art-tag.dto';
import { UpdateArtTagDto } from './dto/update-art-tag.dto';

@Injectable()
export class ArtTagsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateArtTagDto) {
    return this.prisma.artTag.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.artTag.findMany();
  }

  findOne(id: string) {
    return this.prisma.artTag.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateArtTagDto) {
    return this.prisma.artTag.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.artTag.delete({
      where: { id },
    });
  }
}
