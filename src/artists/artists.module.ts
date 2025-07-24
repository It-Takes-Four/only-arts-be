import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/artists/entities/artist.entity';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Art } from 'src/arts/entities/art.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Art, Artist]), UsersModule],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsService],
})
export class ArtistsModule {}