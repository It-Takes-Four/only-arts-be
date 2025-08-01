import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtCollectionDtoRequest } from './dto/request/create-art-collection.dto';
import { UpdateArtCollectionDtoRequest } from './dto/request/update-art-collection.dto';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { ArtistsService } from 'src/artists/artists.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtCollectionDtoResponse } from './dto/response/create-art-collection.dto';
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
  ) {}

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

    return new CreateArtCollectionDtoResponse(
      artist.id,
      collectionId,
      tokenId.toString(),
    );
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

  async findOne(id: string) {
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

    return {
      ...artCollection,
      price: artCollection.price?.toString() ?? null,
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
          artist: { userId: userId },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: collections.map((c) => ({
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

  async findAllCollectionsByArtistId(
    artistId: string,
    page: number = 1,
    limit: number = 10,
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
          artistId: artistId,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: collections.map((c) => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findAllArtsFromUserCollections(userId: string) {
    const collections = await this.prisma.artCollection.findMany({
      where: {
        artist: { userId: userId },
      },
      include: {
        arts: {
          include: {
            art: {
              include: {
                tags: { include: { tag: true } },
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

  update(id: string, dto: UpdateArtCollectionDtoRequest) {
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
