import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResource } from '../common/resources/paginated.resource';
import { 
  SearchArtResource, 
  SearchCollectionResource, 
  SearchArtistResource,
  SearchAllResource 
} from './resources/search.resource';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  // Search for arts that are NOT in collections (paginated)
  async searchArts(query: string, page = 1, limit = 20) {
    if (!query || query.trim().length < 1) {
      throw new BadRequestException('Search query too short.');
    }

    const trimmedQuery = query.trim();
    const skip = (page - 1) * limit;

    const [arts, totalArts] = await Promise.all([
      this.prisma.art.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  title: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
              ],
            },
            {
              isInACollection: false, // Only arts not in collections
            },
          ],
        },
        skip,
        take: limit,
        include: {
          artist: {
            include: {
              user: {
                select: {
                  username: true,
                  profilePictureFileId: true,
                },
              },
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          datePosted: 'desc',
        },
      }),
      this.prisma.art.count({
        where: {
          AND: [
            {
              OR: [
                {
                  title: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
              ],
            },
            {
              isInACollection: false,
            },
          ],
        },
      }),
    ]);

    return PaginatedResource.make(
      {
        data: arts,
        pagination: {
          page,
          limit,
          total: totalArts,
          totalPages: Math.ceil(totalArts / limit),
        },
      },
      SearchArtResource
    );
  }

  // Search for collections (paginated)
  async searchCollections(query: string, page = 1, limit = 20) {
    if (!query || query.trim().length < 1) {
      throw new BadRequestException('Search query too short.');
    }

    const trimmedQuery = query.trim();
    const skip = (page - 1) * limit;

    const [collections, totalCollections] = await Promise.all([
      this.prisma.artCollection.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  collectionName: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
              ],
            },
            {
              isPublished: true, // Only published collections
            },
          ],
        },
        skip,
        take: limit,
        include: {
          artist: {
            include: {
              user: {
                select: {
                  username: true,
                  profilePictureFileId: true,
                },
              },
            },
          },
          arts: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.artCollection.count({
        where: {
          AND: [
            {
              OR: [
                {
                  collectionName: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
              ],
            },
            {
              isPublished: true,
            },
          ],
        },
      }),
    ]);

    // Convert price to string for collections
    const collectionsWithStringPrice = collections.map(collection => ({
      ...collection,
      price: collection.price?.toString() ?? null
    }));

    return PaginatedResource.make(
      {
        data: collectionsWithStringPrice,
        pagination: {
          page,
          limit,
          total: totalCollections,
          totalPages: Math.ceil(totalCollections / limit),
        },
      },
      SearchCollectionResource
    );
  }

  // Search for artists (paginated)
  async searchArtists(query: string, page = 1, limit = 20) {
    if (!query || query.trim().length < 1) {
      throw new BadRequestException('Search query too short.');
    }

    const trimmedQuery = query.trim();
    const skip = (page - 1) * limit;

    const [artists, totalArtists] = await Promise.all([
      this.prisma.artist.findMany({
        where: {
          OR: [
            {
              artistName: {
                contains: trimmedQuery,
                mode: 'insensitive',
              },
            },
            {
              bio: {
                contains: trimmedQuery,
                mode: 'insensitive',
              },
            },
            {
              user: {
                username: {
                  contains: trimmedQuery,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              username: true,
              profilePictureFileId: true,
            },
          },
        },
        orderBy: [
          { isVerified: 'desc' },
          { totalFollowers: 'desc' },
          { totalArts: 'desc' },
        ],
      }),
      this.prisma.artist.count({
        where: {
          OR: [
            {
              artistName: {
                contains: trimmedQuery,
                mode: 'insensitive',
              },
            },
            {
              bio: {
                contains: trimmedQuery,
                mode: 'insensitive',
              },
            },
            {
              user: {
                username: {
                  contains: trimmedQuery,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
      }),
    ]);

    return PaginatedResource.make(
      {
        data: artists,
        pagination: {
          page,
          limit,
          total: totalArtists,
          totalPages: Math.ceil(totalArtists / limit),
        },
      },
      SearchArtistResource
    );
  }

  // Search all (not paginated, limited results from each category)
  async searchAll(query: string) {
    if (!query || query.trim().length < 1) {
      throw new BadRequestException('Search query too short.');
    }

    const trimmedQuery = query.trim();
    const limitPerCategory = 5; // Show only 5 results per category

    const [arts, collections, artists] = await Promise.all([
      // Arts not in collections
      this.prisma.art.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  title: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
              ],
            },
            {
              isInACollection: false,
            },
          ],
        },
        take: limitPerCategory,
        include: {
          artist: {
            include: {
              user: {
                select: {
                  username: true,
                  profilePictureFileId: true,
                },
              },
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          datePosted: 'desc',
        },
      }),
      // Published collections
      this.prisma.artCollection.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  collectionName: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: trimmedQuery,
                    mode: 'insensitive',
                  },
                },
              ],
            },
            {
              isPublished: true,
            },
          ],
        },
        take: limitPerCategory,
        include: {
          artist: {
            include: {
              user: {
                select: {
                  username: true,
                  profilePictureFileId: true,
                },
              },
            },
          },
          arts: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      // Artists
      this.prisma.artist.findMany({
        where: {
          OR: [
            {
              artistName: {
                contains: trimmedQuery,
                mode: 'insensitive',
              },
            },
            {
              bio: {
                contains: trimmedQuery,
                mode: 'insensitive',
              },
            },
            {
              user: {
                username: {
                  contains: trimmedQuery,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        take: limitPerCategory,
        include: {
          user: {
            select: {
              username: true,
              profilePictureFileId: true,
            },
          },
        },
        orderBy: [
          { isVerified: 'desc' },
          { totalFollowers: 'desc' },
          { totalArts: 'desc' },
        ],
      }),
    ]);

    // Convert price to string for collections (same fix as in searchCollections)
    const collectionsWithStringPrice = collections.map(collection => ({
      ...collection,
      price: collection.price?.toString() ?? null
    }));

    const searchData = {
      arts: SearchArtResource.collection(arts),
      collections: SearchCollectionResource.collection(collectionsWithStringPrice),
      artists: SearchArtistResource.collection(artists),
    };

    return SearchAllResource.make(searchData);
  }
}
