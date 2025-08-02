import { Module } from '@nestjs/common';
import { ArtsService } from './arts.service';
import { ArtController } from './arts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistsModule } from '../artists/artists.module';
import { ArtistsService } from '../artists/artists.service';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [ArtistsModule, NotificationsModule],
  controllers: [ArtController],
  providers: [
    ArtsService, 
    PrismaService, 
    ArtistsService, 
    ArtNftService, 
    FileUploadService
  ],
})
export class ArtsModule {}