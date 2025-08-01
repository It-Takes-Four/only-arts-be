import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationQueryDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          collections: true,
          feed: true,
          followers: true,
          arts: {
            include: {
              collections: { include: { collection: true } },
              tags: { include: { tag: true } },
              comments: { include: { user: true } },
            },
          },
        },
      }),
      this.prisma.artist.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        user: true,
        collections: true,
        arts: {
          include: {
            collections: { include: { collection: true } },
            tags: { include: { tag: true } },
            comments: { include: { user: true } },
          },
        },
        feed: true,
        followers: true,
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
        arts: {
          include: {
            collections: { include: { collection: true } },
            tags: { include: { tag: true } },
            comments: { include: { user: true } },
          },
        },
        feed: true,
        followers: true,
      },
    });

    if (!artist)
      throw new NotFoundException(`Artist for user ID ${userId} not found`);
    return artist;
  }

  async findByUserIdSimple(userId: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            profilePictureFileId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!artist)
      throw new NotFoundException(`Artist for user ID ${userId} not found`);
    return artist;
  }

  async findByIdSimple(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            profilePictureFileId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!artist) throw new NotFoundException(`Artist with ID ${id} not found`);
    return artist;
  }

  async create(createArtistDto: CreateArtistDto, userId: string) {
    return this.prisma.artist.create({
      data: {
        artistName: createArtistDto.artistName,
        bio: createArtistDto.bio,
        isNsfw: createArtistDto.isNsfw,
        user: { connect: { id: userId } },
      },
    });
  }

  async updateByUserId(userId: string, dto: UpdateArtistDto) {
    const artist = await this.findByUserIdSimple(userId);
    return this.prisma.artist.update({
      where: { id: artist.id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            profilePictureFileId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async updateWalletAddress(userId: string, walletAddress: string) {
    const artist = await this.findByUserIdSimple(userId);
    return this.prisma.artist.update({
      where: { id: artist.id },
      data: { walletAddress },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            profilePictureFileId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async deleteByUserId(userId: string) {
    const artist = await this.findByUserId(userId);
    return this.prisma.artist.delete({
      where: { id: artist.id },
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
