import { Module } from '@nestjs/common';
import { ArtToTagService } from './art-to-tag.service';
import { ArtToTagController } from './art-to-tag.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ArtToTagController],
  providers: [ArtToTagService, PrismaService],
})
export class ArtToTagModule {}