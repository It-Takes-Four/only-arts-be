import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';

@Module({
  controllers: [FeedsController],
  providers: [FeedsService, PrismaService, FileUploadService],
})
export class FeedsModule {}