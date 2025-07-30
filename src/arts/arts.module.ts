import { Module } from '@nestjs/common';
import { ArtsService } from './arts.service';
import { ArtController } from './arts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistsModule } from '../artists/artists.module';
import { ArtistsService } from '../artists/artists.service';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';

@Module({
  controllers: [ArtController],
  providers: [ArtsService, PrismaService, ArtistsService, ArtNftService, FileUploadService],
  imports: [ArtistsModule],
})
export class ArtsModule {}