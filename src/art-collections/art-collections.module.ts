import { Module } from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { ArtCollectionsController } from './art-collections.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtNftService } from 'src/art-nft/art-nft.service';

@Module({
  controllers: [ArtCollectionsController],
  providers: [ArtCollectionsService, PrismaService, ArtNftService],
})
export class ArtCollectionsModule {}