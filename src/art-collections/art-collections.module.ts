import { Module } from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { ArtCollectionsController } from './art-collections.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { ArtsService } from 'src/arts/arts.service';
import { CollectionAccessService } from 'src/collection-access/collection-access.service';
import { PurchasesService } from 'src/purchases/purchases.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';

@Module({
  controllers: [ArtCollectionsController],
  providers: [ArtCollectionsService, PrismaService, ArtNftService, CollectionAccessService, PurchasesService, FileUploadService],
})
export class ArtCollectionsModule {}