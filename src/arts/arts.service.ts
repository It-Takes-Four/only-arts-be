import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtDtoRequest } from './dto/request/create-art.dto';
import { CreateArtResponse } from './dto/response/create-art.dto';
import { UpdateArtDtoRequest } from './dto/request/update-art.dto';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { ArtistsService } from 'src/artists/artists.service';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService, UploadedFile } from 'src/shared/services/file-upload.service';
import { FileType, NotificationType } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ArtsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly artNftService: ArtNftService,
    private readonly artistsService: ArtistsService,
    private readonly fileUploadService: FileUploadService,
    private readonly notificationsService: NotificationsService
  ) { }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [arts, total] = await Promise.all([
      this.prisma.art.findMany({
        include: {
          artist: {
            include: {
              user: {
                select: {
                  profilePictureFileId: true
                }
              }
            }
          },
          comments: true,
          tags: { include: { tag: true } },
          collections: true,
        },
        skip,
        take: limit,
        orderBy: { datePosted: 'desc' },
      }),
      this.prisma.art.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: arts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findById(id: string, userId?: string) {
    const art = await this.prisma.art.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            user: {
              select: {
                profilePictureFileId: true
              }
            }
          }
        },
        comments: true,
        tags: { include: { tag: true } },
        collections: true,
      },
    });
    if (!art) throw new NotFoundException(`Art with ID ${id} not found`);

    // recalculate likesCount
    const likeCount = await this.prisma.artLike.count({
      where: {
        artId: id,
      },
    });

    // Update likesCount field
    await this.prisma.art.update({
      where: { id },
      data: {
        likesCount: likeCount,
      },
    });

    let isLiked = false;

    if (userId) {
      const like = await this.prisma.artLike.findUnique({
        where: {
          userId_artId: {
            userId,
            artId: id
          }
        }
      });
      isLiked = !!like;
    }

    return {
      ...art,
      isLiked
    };
  }

  async findByArtist(artistId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [arts, total] = await Promise.all([
      this.prisma.art.findMany({
        where: { artistId },
        include: {
          artist: {
            include: {
              user: {
                select: {
                  profilePictureFileId: true
                }
              }
            }
          },
          comments: true,
          tags: { include: { tag: true } },
          collections: true,
        },
        skip,
        take: limit,
        orderBy: { datePosted: 'desc' },
      }),
      this.prisma.art.count({
        where: { artistId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: arts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [arts, total] = await Promise.all([
      this.prisma.art.findMany({
        where: { artist: { userId: userId } },
        include: {
          artist: {
            include: {
              user: {
                select: {
                  profilePictureFileId: true
                }
              }
            }
          },
          comments: true,
          tags: { include: { tag: true } },
          collections: true,
        },
        skip,
        take: limit,
        orderBy: { datePosted: 'desc' },
      }),
      this.prisma.art.count({
        where: { artist: { userId: userId } },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: arts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async createWithTags(dto: CreateArtDtoRequest, file: Express.Multer.File, userId: string) {
    // Get the artist record for the authenticated user
    const artist = await this.artistsService.findByUserId(userId);

    const validFile = file as UploadedFile;
    const artId = uuidv4();
    const tagIds = dto.tagIds?.length ? dto.tagIds : [];

    const saveFileResult = await this.fileUploadService.saveFile(validFile, FileType.arts);
    const imageFileId = saveFileResult.fileId

    const createArtResult = await this.artNftService.createArt(artist.id, artId);
    const tokenId = BigInt(createArtResult.tokenId);

    const createArtPrismaResult = await this.prisma.art.create({
      data: {
        id: artId,
        tokenId: tokenId,
        title: dto.title,
        description: dto.description,
        imageFileId: imageFileId,
        artistId: artist.id,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        artist: true,
        tags: { include: { tag: true } },
      },
    });

    await this.prisma.artist.update({
      where: { id: artist.id },
      data: {
        totalArts: { increment: 1 },
      },
    });

    await this.notificationsService.sendNotificationsToUserFollower({
      message: `${artist.artistName} just posted a new Art ${createArtPrismaResult.title}.`,
      notificationItemId: createArtPrismaResult.id,
      notificationType: NotificationType.arts,
      userId: userId
    });

    return new CreateArtResponse(artist.id, artId, tokenId.toString())
  }


  async updateWithTags(id: string, dto: UpdateArtDtoRequest) {
    const { tagIds, ...updateData } = dto;

    if (tagIds) {
      await this.prisma.artToArtTag.deleteMany({ where: { artId: id } });
    }

    return this.prisma.art.update({
      where: { id },
      data: {
        ...updateData,
        ...(tagIds
          ? {
            tags: {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            },
          }
          : {}),
      },
      include: {
        artist: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.art.delete({ where: { id } });
  }
}
