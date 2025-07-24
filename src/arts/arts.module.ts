import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { ArtService } from './arts.service';
import { ArtController } from './arts.controller';
import { Artist } from 'src/artists/entities/artist.entity';
import { ArtistsModule } from 'src/artists/artists.module';

@Module({
  imports: [TypeOrmModule.forFeature([Art, Artist]), ArtistsModule],
  controllers: [ArtController],
  providers: [ArtService],
})
export class ArtsModule {}