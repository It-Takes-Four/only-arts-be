import { Module } from '@nestjs/common';
import { ArtService } from './arts.service';
import { ArtController } from './arts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  controllers: [ArtController],
  providers: [ArtService, PrismaService],
  imports: [ArtistsModule],
})
export class ArtsModule {}