import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface ExploreArt {
  id: string;
  title: string;
  description: string;
  imageFileId: string;
  datePosted: Date;
  likesCount: number;
  isInACollection: boolean;
  artistId: string;
  artistName: string;
  artistProfileFileId: string | null;
  tags: { id: string; tagName: string }[];
}

@Injectable()
export class ExploreService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; tagId?: string; search?: string }) {
    const { page = 1, limit = 20, tagId, search } = query;
    
    // Ensure page and limit are numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Build the where clause
    const whereClause: {
      tags?: {
        some: {
          tagId: string;
        };
      };
      OR?: Array<{
        title?: {
          contains: string;
          mode: 'insensitive';
        };
        description?: {
          contains: string;
          mode: 'insensitive';
        };
      }>;
    } = {};
    
    if (tagId) {
      whereClause.tags = {
        some: {
          tagId: tagId,
        },
      };
    }

    if (search) {
      whereClause.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [arts, total] = await Promise.all([
      this.prisma.art.findMany({
        where: whereClause,
        include: {
          artist: {
            select: {
              id: true,
              artistName: true,
              user: { select: { profilePictureFileId: true } },
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  tagName: true,
                },
              },
            },
          },
        },
        orderBy: { datePosted: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.art.count({ where: whereClause }),
    ]);

    const exploreArts: ExploreArt[] = arts.map((art) => ({
      id: art.id,
      title: art.title,
      description: art.description,
      imageFileId: art.imageFileId,
      datePosted: art.datePosted,
      likesCount: art.likesCount,
      isInACollection: art.isInACollection,
      artistId: art.artistId,
      artistName: art.artist.artistName,
      artistProfileFileId: art.artist.user.profilePictureFileId,
      tags: art.tags.map((relation) => ({
        id: relation.tag.id,
        tagName: relation.tag.tagName,
      })),
    }));

    return {
      data: exploreArts,
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async findById(id: string): Promise<ExploreArt | null> {
    const art = await this.prisma.art.findUnique({
      where: { id },
      include: {
        artist: {
          select: {
            id: true,
            artistName: true,
            user: { select: { profilePictureFileId: true } },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                tagName: true,
              },
            },
          },
        },
      },
    });

    if (!art) return null;

    return {
      id: art.id,
      title: art.title,
      description: art.description,
      imageFileId: art.imageFileId,
      datePosted: art.datePosted,
      likesCount: art.likesCount,
      isInACollection: art.isInACollection,
      artistId: art.artistId,
      artistName: art.artist.artistName,
      artistProfileFileId: art.artist.user.profilePictureFileId,
      tags: art.tags.map((relation) => ({
        id: relation.tag.id,
        tagName: relation.tag.tagName,
      })),
    };
  }

  async findByArtist(
    artistId: string,
    pagination: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 20 } = pagination;
    
    // Ensure page and limit are numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [arts, total] = await Promise.all([
      this.prisma.art.findMany({
        where: { artistId },
        include: {
          artist: {
            select: {
              id: true,
              artistName: true,
              user: { select: { profilePictureFileId: true } },
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  tagName: true,
                },
              },
            },
          },
        },
        orderBy: { datePosted: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.art.count({ where: { artistId } }),
    ]);

    const exploreArts: ExploreArt[] = arts.map((art) => ({
      id: art.id,
      title: art.title,
      description: art.description,
      imageFileId: art.imageFileId,
      datePosted: art.datePosted,
      likesCount: art.likesCount,
      isInACollection: art.isInACollection,
      artistId: art.artistId,
      artistName: art.artist.artistName,
      artistProfileFileId: art.artist.user.profilePictureFileId,
      tags: art.tags.map((relation) => ({
        id: relation.tag.id,
        tagName: relation.tag.tagName,
      })),
    }));

    return {
      data: exploreArts,
      total,
      page: pageNum,
      limit: limitNum,
    };
  }
}
