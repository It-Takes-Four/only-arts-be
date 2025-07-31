import { Module } from '@nestjs/common';
import { ArtLikeService } from './art-like.service';
import { ArtLikeController } from './art-like.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ArtLikeController],
  providers: [ArtLikeService, PrismaService],
})
export class ArtLikeModule {}
