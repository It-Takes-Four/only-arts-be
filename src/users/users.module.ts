import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, FileUploadService],
  exports: [UsersService],
})
export class UsersModule {}
