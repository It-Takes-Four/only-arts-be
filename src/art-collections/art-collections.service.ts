import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtCollectionDto } from './dto/create-art-collection.dto';
import { UpdateArtCollectionDto } from './dto/update-art-collection.dto';

@Injectable()
export class ArtCollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateArtCollectionDto) {
    return this.prisma.artCollection.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.artCollection.findMany();
  }

  findOne(id: string) {
    return this.prisma.artCollection.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateArtCollectionDto) {
    return this.prisma.artCollection.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.artCollection.delete({
      where: { id },
    });
  }
}
