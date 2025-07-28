import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.artist.findMany({
      include: {
        user: true,
        collections: true,
        feed: true,
        followers: true,
        notifications: true,
        arts: {
          include: {
            collections: {
              include: {
                collection: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
            comments: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        user: true,
        collections: true,
        arts: {
          include: {
            collections: {
              include: {
                collection: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
            comments: {
              include: {
                user: true,
              },
            },
          },
        },
        feed: true,
        followers: true,
        notifications: true,
      },
    });

    if (!artist) throw new NotFoundException(`Artist with ID ${id} not found`);
    return artist;
  }

  async findByUserId(userId: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { userId },
      include: {
        user: true,
        collections: true,
        arts: true,
        feed: true,
        followers: true,
        notifications: true,
      },
    });

    if (!artist)
      throw new NotFoundException(`Artist for user ID ${userId} not found`);
    return artist;
  }

  async create(createArtistDto: CreateArtistDto, userId: string) {
    return this.prisma.artist.create({
      data: {
        artistName: createArtistDto.artistName,
        bio: createArtistDto.bio,
        isNsfw: createArtistDto.isNsfw,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async update(id: string, dto: UpdateArtistDto) {
    return this.prisma.artist.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.artist.delete({ where: { id } });
  }
}
