import { Module } from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { ArtCollectionsController } from './art-collections.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ArtCollectionsController],
  providers: [ArtCollectionsService, PrismaService],
})
export class ArtCollectionsModule {}