// art-collections.module.ts
import { Module } from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { ArtCollectionsController } from './art-collections.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { ArtistsService } from 'src/artists/artists.service';
import { CollectionAccessService } from 'src/collection-access/collection-access.service';
import { PurchasesService } from 'src/purchases/purchases.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { NotificationsModule } from 'src/notifications/notifications.module'; // Import the module

@Module({
  imports: [NotificationsModule],
  controllers: [ArtCollectionsController],
  providers: [
    ArtCollectionsService, 
    PrismaService, 
    ArtNftService, 
    ArtistsService, 
    CollectionAccessService, 
    PurchasesService, 
    FileUploadService
  ],
})
export class ArtCollectionsModule {}