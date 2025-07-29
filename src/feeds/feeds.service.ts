import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { ArtCollectionFeed, ArtFeed, FindAllDtoResponse, Post } from './dto/response/find-all-dto';
import { FileUploadService } from 'src/shared/services/file-upload.service';

@Injectable()
export class FeedsService {
  constructor(private readonly prisma: PrismaService, private readonly fileUploadService: FileUploadService) { }

  async create(dto: CreateFeedDto) {
    return this.prisma.feed.create({ data: dto });
  }

  async findAll(pagination: { page?: number; limit?: number }) {
    const response: FindAllDtoResponse[] = []
    const { page = 1, limit = 10 } = pagination;

    const arts = await this.prisma.art.findMany({
      include: {
        artist: {
          select: {
            id: true,
            artistName: true,
            user: { select: { profilePictureFileId: true } },
          }
        }
      }
    });

    for (const art of arts) {
      const feedItem = new FindAllDtoResponse(
        null,
        new ArtFeed(
          art.artistId,
          art.artist.artistName,
          art.artist.user.profilePictureFileId,
          art.description,
          art.imageFileId,
          art.title,
          art.datePosted
        ),
        null,
        art.datePosted,
        'art'
      );

      response.push(feedItem);
    }

    // Get all collections
    const collections = await this.prisma.artCollection.findMany({
      include: {
        artist: {
          select: {
            id: true,
            artistName: true,
            user: { select: { profilePictureFileId: true } },
          },
        },
      },
    });

    for (const collection of collections) {
      const feedItem = new FindAllDtoResponse(
        null,
        null,
        new ArtCollectionFeed(
          collection.artistId,
          collection.artist.artistName,
          collection.artist.user.profilePictureFileId,
          collection.description,
          collection.coverImageFileId,
          collection.collectionName,
          collection.createdAt
        ),
        collection.createdAt,
        'collection'
      );

      response.push(feedItem);
    }

    const feeds = await this.prisma.feed.findMany({
      include: {
        artist: {
          select: {
            id: true,
            artistName: true,
            user: { select: { profilePictureFileId: true } },
          }
        }
      }
    })

    for (const post of feeds) {
      const feedItem = new FindAllDtoResponse(
        new Post(
          post.artistId,
          post.artist.artistName,
          post.artist.user.profilePictureFileId,
          post.content,
          post.datePosted
        ),
        null,
        null,
        post.datePosted,
        'post'
      );

      response.push(feedItem);
    }

    // Sort combined feed by datePosted (descending)
    response.sort((a, b) => +new Date(b.createdDate) - +new Date(a.createdDate));

    // Pagination manually
    const total = response.length;
    const paginated = response.slice((page - 1) * limit, page * limit);

    return {
      data: paginated,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
  const feed = await this.prisma.feed.findUnique({
    where: { id },
    include: {
      artist: {
        select: {
          id: true,
          user: { select: { username: true } },
        },
      },
    },
  });
  if (!feed) throw new NotFoundException(`Feed with ID ${id} not found`);
  return feed;
}

  async update(id: string, dto: UpdateFeedDto) {
  await this.findOne(id);
  return this.prisma.feed.update({
    where: { id },
    data: dto,
  });
}

  async remove(id: string) {
  await this.findOne(id);
  return this.prisma.feed.delete({ where: { id } });
}

  async findByArtist(
  artistId: string,
  pagination: { page?: number; limit?: number },
) {
  const { page = 1, limit = 10 } = pagination;

  const [feeds, total] = await Promise.all([
    this.prisma.feed.findMany({
      where: { artistId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { datePosted: 'desc' },
    }),
    this.prisma.feed.count({ where: { artistId } }),
  ]);

  return {
    data: feeds,
    total,
    page,
    limit,
  };
}
}
