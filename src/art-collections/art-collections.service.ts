import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtCollectionDtoRequest } from './dto/request/create-art-collection.dto';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { ArtistsService } from 'src/artists/artists.service';
import { v4 as uuidv4 } from 'uuid';
import { CollectionAccessService } from 'src/collection-access/collection-access.service';
import { PurchasesService } from 'src/purchases/purchases.service';
import { PrepareCollectionPurchaseDtoRequest } from './dto/request/prepare-collection-purchase.dto';
import { CompletePurchaseDtoRequest } from './dto/request/complete-purchase.dto';
import { CompletePurchaseDtoResponse } from './dto/response/complete-purchase.dto';
import {
  FileUploadService,
  UploadedFile,
} from 'src/shared/services/file-upload.service';
import { FileType, NotificationType } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UpdateCollectionContentDtoRequest } from './dto/request/update-collection-content.dto';
import { UpdateArtCollectionDtoRequest } from './dto/request/update-art-collection.dto';
import { CreateArtDtoRequest } from 'src/arts/dto/request/create-art.dto';

@Injectable()
export class ArtCollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly artNftService: ArtNftService,
    private readonly artistsService: ArtistsService,
    private readonly collectionAccessService: CollectionAccessService,
    private readonly purchasesService: PurchasesService,
    private readonly fileUploadService: FileUploadService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(
    dto: CreateArtCollectionDtoRequest,
    imageCover: Express.Multer.File | undefined,
    userId: string,
  ) {
    // Get the artist record for the authenticated user
    const artist = await this.artistsService.findByUserId(userId);

    const collectionId = uuidv4();
    const createCollectionResult = await this.artNftService.createCollection(
      artist.id,
      collectionId,
    );
    const tokenId = BigInt(createCollectionResult.tokenId);

    const validFile = imageCover as UploadedFile;
    const saveFileResult = await this.fileUploadService.saveFile(
      validFile,
      FileType.collections,
    );
    const coverImageFileId = saveFileResult.fileId;

    const createArtCollectionPrismaResult =
      await this.prisma.artCollection.create({
        data: {
          id: collectionId,
          collectionName: dto.collectionName,
          description: dto.description,
          price: dto.price,
          artistId: artist.id,
          coverImageFileId: coverImageFileId,
        },
      });

    // TODO: move this into publish collection function
    await this.notificationsService.sendNotificationsToUserFollower({
      message: `${artist.artistName} just published a new Collection ${createArtCollectionPrismaResult.collectionName}.`,
      notificationItemId: createArtCollectionPrismaResult.id,
      notificationType: NotificationType.collections,
      userId: userId,
    });

    return await this.findOne(createArtCollectionPrismaResult.id)

    // return new CreateArtCollectionDtoResponse(
    //   artist.id,
    //   collectionId,
    //   tokenId.toString(),
    // );
  }

  async validatePurchase(collectionId: string, buyerUserId: string) {
    // Check if collection exists
    const collection = await this.findOne(collectionId);

    if (!collection) {
      throw new BadRequestException('Collection does not exist');
    }

    // Verify that user does not have access yet
    const hasAccess = await this.collectionAccessService.hasAccessToCollection(
      buyerUserId,
      collectionId,
    );

    if (hasAccess) {
      throw new BadRequestException('Buyer already has access to collection');
    }
  }

  async prepareCollectionPurchase(dto: PrepareCollectionPurchaseDtoRequest) {
    const artCollection = await this.findOne(dto.collectionId);

    if (artCollection == null || !artCollection.isPublished) {
      throw new BadRequestException('Collection not found');
    }

    const hasAccess = await this.collectionAccessService.hasAccessToCollection(
      dto.buyerId,
      dto.collectionId,
    );

    if (hasAccess) {
      throw new BadRequestException('Buyer already has access to collection');
    }

    if (!artCollection.price) {
      throw new BadRequestException('price is undefined');
    }

    const price = artCollection.price.toString();

    const updatedDto = {
      ...dto,
      price,
    };

    return await this.collectionAccessService.prepareCollectionPurchase(
      updatedDto,
    );
  }

  async completePurchase(dto: CompletePurchaseDtoRequest) {
    const artCollection = await this.prisma.artCollection.findFirst({
      where: {
        id: dto.collectionId,
      },
    });

    if (artCollection == null || !artCollection.isPublished) {
      throw new BadRequestException('Collection not found');
    }

    const price = artCollection.price!.toNumber();

    // Create a new purchase record
    await this.purchasesService.createNewPurchase({
      collectionId: dto.collectionId,
      price: price,
      txHash: dto.txHash,
      userId: dto.buyerId,
    });

    // Verify the purchase record from the contract
    const result = await this.collectionAccessService.verifyPurchase(
      dto.txHash,
    );

    if (!result) {
      return new InternalServerErrorException('Could not verify transaction');
    }

    // Update purchase record status to COMPLETED
    const completePurchaseResult = await this.purchasesService.completePurchase(
      dto.txHash,
    );

    await this.notificationsService.create({
      message: `Your purchase on Collection ${artCollection.collectionName} is completed.`,
      notificationItemId: completePurchaseResult.id,
      notificationType: NotificationType.payments,
      userId: dto.buyerId,
    });

    return new CompletePurchaseDtoResponse(
      dto.collectionId,
      dto.buyerId,
      price,
      dto.txHash,
    );
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [artCollections, total] = await Promise.all([
      this.prisma.artCollection.findMany({
        where: {
          isPublished: true, // Only show published collections
        },
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
          arts: true, // Only count, don't include full art data
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.artCollection.count({
        where: {
          isPublished: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: artCollections.map((c) => ({
        ...c,
        price: c.price?.toString() ?? null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const artCollection = await this.prisma.artCollection.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            user: {
              select: {
                profilePictureFileId: true,
              },
            },
          },
        },
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

    if (!artCollection) return null;


    let purchasedCollectionIds: string[] = [];
    if (userId) {
      purchasedCollectionIds = await this.collectionAccessService.getUserPurchasedCollections(userId);
    }

    return {
      ...artCollection,
      price: artCollection.price?.toString() ?? null,
      isPurchased: userId ? purchasedCollectionIds.includes(artCollection.id) : false,
    };
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

  async findAllCollectionsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [collections, total] = await Promise.all([
      this.prisma.artCollection.findMany({
        where: {
          artist: { userId: userId },
        },
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
          _count: {
            select: { arts: true },
          }, // Only count, don't include full art data
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.artCollection.count({
        where: {
          artist: { userId: userId },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: collections.map((c) => ({
        ...c,
        price: c.price?.toString() ?? null,
        isPurchased: false,
        artsCount: c._count.arts,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findAllCollectionsByArtistId(
    artistId: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ) {
    const skip = (page - 1) * limit;

    const [collections, total] = await Promise.all([
      this.prisma.artCollection.findMany({
        where: {
          artistId: artistId,
        },
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
          _count: {
            select: { arts: true },
          }, // Only count, don't include full art data // Only count, don't include full art data
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.artCollection.count({
        where: {
          artistId: artistId,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Get purchased collections if userId is provided
    let purchasedCollectionIds: string[] = [];
    if (userId) {
      purchasedCollectionIds = await this.collectionAccessService.getUserPurchasedCollections(userId);
    }

    return {
      data: collections.map((c) => ({
        ...c,
        price: c.price?.toString() ?? null,
        isPurchased: userId ? purchasedCollectionIds.includes(c.id) : false,
        artsCount: c._count.arts,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findPurchasedCollections(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const purchasedCollectionIds =
      await this.collectionAccessService.getUserPurchasedCollections(userId);

    const skip = (page - 1) * limit;

    const [purchasedCollections, total] = await Promise.all([
      this.prisma.artCollection.findMany({
        where: {
          id: {
            in: purchasedCollectionIds,
          },
        },
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
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.artCollection.count({
        where: {
          id: {
            in: purchasedCollectionIds,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: purchasedCollections.map((collection) => ({
        ...collection,
        price: collection.price?.toString() ?? null,
        isPurchased: true, // These are purchased collections
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findAllArtsFromUserCollections(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // First, get all collection IDs for the user
    const userCollections = await this.prisma.artCollection.findMany({
      where: {
        artist: { userId: userId },
      },
      select: { id: true },
    });

    const collectionIds = userCollections.map(c => c.id);

    if (collectionIds.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // Get paginated arts and total count
    const [artCollectionRelations, total] = await Promise.all([
      this.prisma.artToCollection.findMany({
        where: {
          collectionId: { in: collectionIds },
        },
        include: {
          art: {
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
          },
        },
        skip,
        take: limit,
        orderBy: { art: { datePosted: 'desc' } },
      }),
      this.prisma.artToCollection.count({
        where: {
          collectionId: { in: collectionIds },
        },
      }),
    ]);



    const arts = artCollectionRelations.map(relation => relation.art);
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

  async update(id: string, dto: UpdateArtCollectionDtoRequest) {
    // First check if the collection exists and is not published
    const existingCollection = await this.prisma.artCollection.findUnique({
      where: { id },
      select: { isPublished: true },
    });

    if (!existingCollection) {
      throw new NotFoundException('Collection not found');
    }

    if (existingCollection.isPublished) {
      throw new BadRequestException('Cannot modify a published collection');
    }

    const updatedCollection = await this.prisma.artCollection.update({
      where: { id },
      data: dto,
      include: {
        artist: {
          include: {
            user: {
              select: {
                username: true,
                profilePictureFileId: true,
              }
            }
          }
        },
        arts: true, // Only count, don't include full art data
      },
    });

    return {
      ...updatedCollection,
      price: updatedCollection.price?.toString() ?? null,
      isPurchased: false, // User's own collection
    };
  }

  async updateCoverImage(id: string, coverImageFile: Express.Multer.File) {
    // First check if the collection exists and is not published
    const existingCollection = await this.prisma.artCollection.findUnique({
      where: { id },
      select: { isPublished: true },
    });

    if (!existingCollection) {
      throw new NotFoundException('Collection not found');
    }

    if (existingCollection.isPublished) {
      throw new BadRequestException('Cannot modify a published collection');
    }

    // Handle file upload
    const fileResult = await this.fileUploadService.saveFile(coverImageFile, FileType.collections);

    const updatedCollection = await this.prisma.artCollection.update({
      where: { id },
      data: {
        coverImageFileId: fileResult.fileId,
      },
      include: {
        artist: {
          include: {
            user: {
              select: {
                username: true,
                profilePictureFileId: true,
              }
            }
          }
        },
        arts: true, // Only count, don't include full art data
      },
    });

    return {
      ...updatedCollection,
      price: updatedCollection.price?.toString() ?? null,
      isPurchased: false, // User's own collection
    };
  }

  async publish(id: string) {
    const publishedCollection = await this.prisma.artCollection.update({
      where: { id },
      data: { isPublished: true },
      include: {
        artist: {
          include: {
            user: {
              select: {
                username: true,
                profilePictureFileId: true,
              }
            }
          }
        },
        arts: true, // Only count, don't include full art data
      },
    });

    return {
      ...publishedCollection,
      price: publishedCollection.price?.toString() ?? null,
      isPurchased: false, // User's own collection
    };
  }

  async updateCollectionContent(
    collectionId: string,
    dto: UpdateCollectionContentDtoRequest,
    userId: string,
  ) {
    const collection = await this.prisma.artCollection.findUnique({
      where: { id: collectionId },
      include: {
        artist: true,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.artist.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to modify this collection',
      );
    }

    if (collection.isPublished) {
      throw new BadRequestException('Cannot modify a published collection');
    }

    const updateData: any = {};

    if (dto.collectionName !== undefined) {
      updateData.collectionName = dto.collectionName;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }

    if (dto.price !== undefined) {
      updateData.price = dto.price;
    }

    if (dto.artIds !== undefined) {
      await this.prisma.artToCollection.deleteMany({
        where: { collectionId },
      });

      const newRelations = dto.artIds.map((artId) => ({
        id: uuidv4(),
        artId,
        collectionId,
      }));

      await this.prisma.artToCollection.createMany({ data: newRelations });
    }

    if (Object.keys(updateData).length > 0) {
      await this.prisma.artCollection.update({
        where: { id: collectionId },
        data: updateData,
      });
    }

    return { message: 'Collection updated successfully' };
  }

  async createArtInCollection(
    collectionId: string,
    dto: CreateArtDtoRequest,
    file: Express.Multer.File,
    userId: string,
  ) {
    // First check if the collection exists and is not published
    const collection = await this.prisma.artCollection.findUnique({
      where: { id: collectionId },
      include: {
        artist: true,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.artist.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to modify this collection',
      );
    }

    if (collection.isPublished) {
      throw new BadRequestException('Cannot add art to a published collection');
    }

    // Get the artist record for the authenticated user
    const artist = await this.artistsService.findByUserId(userId);

    const validFile = file as UploadedFile;
    const artId = uuidv4();
    const tagIds = dto.tagIds?.length ? dto.tagIds : [];

    const saveFileResult = await this.fileUploadService.saveFile(validFile, FileType.arts);
    const imageFileId = saveFileResult.fileId;

    const createArtResult = await this.artNftService.createArt(artist.id, artId);
    const tokenId = BigInt(createArtResult.tokenId);

    // Create the art
    const createArtPrismaResult = await this.prisma.art.create({
      data: {
        id: artId,
        tokenId: tokenId,
        title: dto.title,
        description: dto.description,
        imageFileId: imageFileId,
        artistId: artist.id,
        isInACollection: true,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
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
        tags: { include: { tag: true } },
        comments: true,
        collections: true,
      },
    });

    // Add the art to the collection
    await this.prisma.artToCollection.create({
      data: {
        id: uuidv4(),
        artId: artId,
        collectionId: collectionId,
      },
    });

    // Update artist total arts count
    await this.prisma.artist.update({
      where: { id: artist.id },
      data: {
        totalArts: { increment: 1 },
      },
    });

    return createArtPrismaResult;
  }

  async removeArtFromCollection(
    collectionId: string,
    artId: string,
    userId: string,
  ) {
    // First check if the collection exists and is not published
    const collection = await this.prisma.artCollection.findUnique({
      where: { id: collectionId },
      include: {
        artist: true,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.artist.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to modify this collection',
      );
    }

    if (collection.isPublished) {
      throw new BadRequestException('Cannot remove art from a published collection');
    }

    // Check if the art exists in the collection
    const artToCollection = await this.prisma.artToCollection.findFirst({
      where: {
        artId: artId,
        collectionId: collectionId,
      },
    });

    if (!artToCollection) {
      throw new NotFoundException('Art not found in this collection');
    }

    // Remove the art from the collection (not delete the art itself)
    await this.prisma.artToCollection.delete({
      where: {
        id: artToCollection.id,
      },
    });

    return { message: 'Art removed from collection successfully' };
  }

  remove(id: string) {
    return this.prisma.artCollection.delete({
      where: { id },
    });
  }

}
