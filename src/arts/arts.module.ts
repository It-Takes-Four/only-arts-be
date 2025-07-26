import { Module } from '@nestjs/common';
import { ArtsService } from './arts.service';
import { ArtController } from './arts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistsModule } from '../artists/artists.module';
import { ArtNftService } from 'src/art-nft/art-nft.service';

@Module({
  controllers: [ArtController],
  providers: [ArtsService, PrismaService, ArtNftService],
  imports: [ArtistsModule],
})
export class ArtsModule {}