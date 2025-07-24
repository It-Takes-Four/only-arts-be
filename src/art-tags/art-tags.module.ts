import { Module } from '@nestjs/common';
import { ArtTagsService } from './art-tags.service';
import { ArtTagsController } from './art-tags.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ArtTagsController],
  providers: [ArtTagsService, PrismaService],
})
export class ArtTagsModule {}