import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResource } from '../common/resources/paginated.resource'; // adjust path if needed

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string, page = 1, limit = 20) {
    if (!query || query.trim().length < 1) {
      throw new BadRequestException('Search query too short.');
    }

    const trimmedQuery = query.trim();
    const skip = (page - 1) * limit;

    const [arts, totalArts, collections, totalCollections] = await Promise.all([
      this.prisma.art.findMany({
        where: {
          title: {
            contains: trimmedQuery,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          imageFile: {
            select: {
              id: true,
              fileName: true,
            },
          },
          artist: {
            select: {
              artistName: true,
            },
          },
        },
      }),
      this.prisma.art.count({
        where: {
          title: {
            contains: trimmedQuery,
            mode: 'insensitive',
          },
        },
      }),
      this.prisma.artCollection.findMany({
        where: {
          collectionName: {
            contains: trimmedQuery,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        select: {
          id: true,
          collectionName: true,
          coverImageFile: {
            select: {
              id: true,
              fileName: true,
            },
          },
          artist: {
            select: {
              artistName: true,
            },
          },
        },
      }),
      this.prisma.artCollection.count({
        where: {
          collectionName: {
            contains: trimmedQuery,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    const artResult = PaginatedResource.make(
      {
        data: arts,
        pagination: {
          page,
          limit,
          total: totalArts,
          totalPages: Math.ceil(totalArts / limit),
        },
      },
      class {
        constructor(private item: any) {}
        toArray() {
          return this.item;
        }
      }
    );

    const collectionResult = PaginatedResource.make(
      {
        data: collections,
        pagination: {
          page,
          limit,
          total: totalCollections,
          totalPages: Math.ceil(totalCollections / limit),
        },
      },
      class {
        constructor(private item: any) {}
        toArray() {
          return this.item;
        }
      }
    );

    return {
      arts: artResult,
      collections: collectionResult,
    };
  }
}
