import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { FileUploadService, UploadedFile } from 'src/shared/services/file-upload.service';
import { FileType } from '@prisma/client';
import { ParsePriceToDecimal } from 'src/shared/utils';

@Injectable()
export class ArtCollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly artNftService: ArtNftService,
    private readonly artistsService: ArtistsService,
    private readonly collectionAccessService: CollectionAccessService,
    private readonly purchasesService: PurchasesService,
    private readonly fileUploadService: FileUploadService
  ) { }

  async create(dto: CreateArtCollectionDtoRequest, imageCover: Express.Multer.File | undefined, userId: string) {
    // Get the artist record for the authenticated user
    const artist = await this.artistsService.findByUserId(userId);

    const collectionId = uuidv4();
    const createCollectionResult = await this.artNftService.createCollection(artist.id, collectionId);
    const tokenId = BigInt(createCollectionResult.tokenId);

    const validFile = imageCover as UploadedFile;
    const saveFileResult = await this.fileUploadService.saveFile(validFile, FileType.collections);
    const coverImageFileId = saveFileResult.fileId

    await this.prisma.artCollection.create({
      data: {
        id: collectionId,
        collectionName: dto.collectionName,
        artistId: artist.id,
        coverImageFileId: coverImageFileId
      },
    });

    return new CreateArtCollectionDtoResponse(artist.id, collectionId, tokenId.toString())
  }



  async validatePurchase(collectionId: string, buyerUserId: string, price: string) {
    // Check if collection exists
    const collection = await this.findOne(collectionId);

    if (!collection) {
      throw new BadRequestException('Collection does not exist');
    }

    // Verify that user does not have access yet
    const hasAccess = await this.collectionAccessService.hasAccessToCollection(buyerUserId, collectionId)

    if (hasAccess) {
      throw new BadRequestException('Buyer already has access to collection');
    }

    const parsedPrice = ParsePriceToDecimal(price)

    if (parsedPrice != collection.price) {
      throw new BadRequestException('Price differs from stated collection price')
    }
  }

  async prepareCollectionPurchase(dto: PrepareCollectionPurchaseDtoRequest) {
    await this.validatePurchase(dto.collectionId, dto.buyerId, dto.price)

    return await this.collectionAccessService.prepareCollectionPurchase(dto)
  }

  async completePurchase(dto: CompletePurchaseDtoRequest) {
    await this.validatePurchase(dto.collectionId, dto.buyerId, dto.price.toString())

    // Create a new purchase record
    await this.purchasesService.createNewPurchase({
      collectionId: dto.collectionId,
      price: dto.price,
      txHash: dto.txHash,
      userId: dto.buyerId
    })

    // Verify the purchase record from the contract
    const result = await this.collectionAccessService.verifyPurchase(dto.txHash);

    if (!result) {
      return new InternalServerErrorException('Could not verify transaction')
    }

    // Update purchase record status to COMPLETED
    await this.purchasesService.completePurchase(dto.txHash)

    return new CompletePurchaseDtoResponse(dto.collectionId, dto.buyerId, dto.price, dto.txHash)
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

  async findAllCollectionsByArtistId(userId: string) {
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
                comments: { include: { user: true } },
                artist: true,
              },
            },
          },
        },
      },
    });

    return collections
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
  };

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
