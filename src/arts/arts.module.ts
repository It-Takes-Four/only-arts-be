import { Module } from '@nestjs/common';
import { ArtsService } from './arts.service';
import { ArtController } from './arts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistsModule } from '../artists/artists.module';
import { ArtistsService } from '../artists/artists.service';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [ArtController],
  providers: [ArtsService, PrismaService, ArtistsService, ArtNftService, FileUploadService, NotificationsService],
  imports: [ArtistsModule],
})
export class ArtsModule {}