import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtCollectionDtoRequest } from './dto/request/create-art-collection.dto';
import { UpdateArtCollectionDtoRequest } from './dto/request/update-art-collection.dto';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtCollectionDtoResponse } from './dto/response/create-art-collection.dto';
import { ArtsService } from 'src/arts/arts.service';
import { CreateWithArtsDtoRequest } from './dto/request/create-with-arts.dto';
import { CollectionAccessService } from 'src/collection-access/collection-access.service';
import { PurchasesService } from 'src/purchases/purchases.service';
import { PrepareCollectionPurchaseDtoRequest } from './dto/request/prepare-collection-purchase.dto';
import { CompletePurchaseDtoRequest } from './dto/request/complete-purchase.dto';
import { CompletePurchaseDtoResponse } from './dto/response/complete-purchase.dto';

@Injectable()
export class ArtCollectionsService {
  constructor(private readonly prisma: PrismaService, private readonly artNftService: ArtNftService, private readonly artsService: ArtsService, private readonly collectionAccessService: CollectionAccessService, private readonly purchasesService: PurchasesService) { }

  async create(dto: CreateArtCollectionDtoRequest) {
    const collectionId = uuidv4();

    const createArtResult = await this.artNftService.createCollection(dto.artistId, collectionId);
    const tokenId = BigInt(createArtResult.tokenId);

    const result = await this.prisma.artCollection.create({
      data: {
        id: collectionId,
        collectionName: dto.collectionName,
        artistId: dto.artistId,
      },
    });

    if (!result) {
      throw new Error('Failed to create art collection in database.');
    }

    return new CreateArtCollectionDtoResponse(dto.artistId, collectionId, tokenId.toString())
  }

  async createWithArts(dto: CreateWithArtsDtoRequest) {
    const collectionId = uuidv4();
    const artIds: string[] = [];

    const arts = dto.arts

    for (let index = 0; index < arts.length; index++) {
      const element = arts[index];

      const result = await this.artsService.createWithTags(element);
      artIds.push(result.artId);

      // Update the art to mark it as part of a collection
      await this.prisma.art.update({
        where: { id: result.artId },
        data: { isInACollection: true },
      });
    }

    const createCollectionResult = await this.artNftService.createCollection(dto.artistId, collectionId);
    const tokenId = BigInt(createCollectionResult.tokenId);

    const result = await this.prisma.artCollection.create({
      data: {
        id: collectionId,
        collectionName: dto.collectionName,
        artistId: dto.artistId,
        price: dto.price,
        arts: {
          create: artIds.map((artId) => ({
            art: { connect: { id: artId } },
          })),
        },
      },
    });

    if (!result) {
      throw new Error('Failed to create art collection in database.');
    }

    return new CreateArtCollectionDtoResponse(dto.artistId, collectionId, tokenId.toString())
  }

  async prepareCollectionPurchase(dto: PrepareCollectionPurchaseDtoRequest) {
    // Check if collection exists
    const collection = await this.findOne(dto.collectionId);

    if (!collection) {
      throw new BadRequestException('Collection does not exist');
    }

    // Verify that user does not have access yet
    const hasAccess = await this.collectionAccessService.hasAccessToCollection(dto.buyerId, dto.collectionId)

    if (hasAccess) {
      throw new BadRequestException('Buyer already has access to collection');
    }

    return this.collectionAccessService.prepareCollectionPurchase(dto)
  }

  async completePurchase(dto: CompletePurchaseDtoRequest) {
    // Create a new purchase record
    await this.purchasesService.createNewPurchase({
      collectionId: dto.collectionId,
      price: dto.price,
      txHash: dto.txHash,
      userId: dto.buyerId
    })

    // Verify the purchase record from the contract
    const result = this.collectionAccessService.verifyPurchase(dto.txHash);

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

  async findAllArtsFromUserCollections(userId: string) {
    const collections = await this.prisma.artCollection.findMany({
      where: {
        artist: { userId },
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
