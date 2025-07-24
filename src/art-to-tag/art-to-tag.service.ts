import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtToArtTagDto } from './dto/create-art-to-tag.dto';
import { UpdateArtToTagDto } from './dto/update-art-to-tag.dto';

@Injectable()
export class ArtToTagService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateArtToArtTagDto) {
    return this.prisma.artToArtTag.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.artToArtTag.findMany();
  }

  findOne(where: { artId: string; tagId: string }) {
  return this.prisma.artToArtTag.findUnique({
    where: {
      artId_tagId: {
        artId: where.artId,
        tagId: where.tagId,
      },
    },
  });
}


update(
  where: { artId: string; tagId: string },
  dto: UpdateArtToTagDto,
) {
  return this.prisma.artToArtTag.update({
    where: {
      artId_tagId: {
        artId: where.artId,
        tagId: where.tagId,
      },
    },
    data: dto,
  });
}

remove(where: { artId: string; tagId: string }) {
  return this.prisma.artToArtTag.delete({
    where: {
      artId_tagId: {
        artId: where.artId,
        tagId: where.tagId,
      },
    },
  });
}

}
