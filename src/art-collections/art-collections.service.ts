import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtCollectionDto } from './dto/request/create-art-collection.dto';
import { UpdateArtCollectionDto } from './dto/request/update-art-collection.dto';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtCollectionResponse } from './dto/response/create-art-collection.dto';

@Injectable()
export class ArtCollectionsService {
  constructor(private readonly prisma: PrismaService, private readonly artNftService: ArtNftService) {}

  async create(dto: CreateArtCollectionDto) {
    const collectionId = uuidv4();

    const createArtResult = await this.artNftService.createCollection(dto.artistId, collectionId);
    const tokenId = BigInt(createArtResult.tokenId);

    const result = this.prisma.artCollection.create({
      data: {
        id: collectionId,
        collectionName: dto.collectionName,
        artistId: dto.artistId,
      },
    });


    return new CreateArtCollectionResponse(dto.artistId, collectionId, tokenId.toString())
  }

  async findAll() {
    return this.prisma.artCollection.findMany({
      include: {
        arts: {
          include: {
            art: {
              include: {
                tags: { include: { tag: true } },
                comments: { include: { user: true } },
                artist: true,
              },
            },
          },
        },
        artist: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.artCollection.findUnique({
      where: { id },
      include: {
        arts: {
          include: {
            art: {
              include: {
                tags: { include: { tag: true } },
                comments: { include: { user: true } },
                artist: true,
              },
            },
          },
        },
        artist: true,
      },
    });
  }

  async findArtsInCollection(id: string) {
    const collection = await this.prisma.artCollection.findUnique({
      where: { id },
      include: {
        arts: {
          include: {
            art: {
              include: {
                tags: { include: { tag: true } },
                comments: { include: { user: true } },
                artist: true,
              },
            },
          },
        },
      },
    });

    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    return collection.arts.map((item) => item.art);
  }

  async findAllArtsFromUserCollections(userId: string) {
    const collections = await this.prisma.artCollection.findMany({
      where: {
        artist: { userId },
      },
      include: {
        arts: {
          include: {
            art: {
              include: {
                tags: { include: { tag: true } },
                comments: { include: { user: true } },
                artist: true,
              },
            },
          },
        },
      },
    });

    return collections.flatMap((collection) =>
      collection.arts.map((item) => item.art),
    );
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
