import { Module } from '@nestjs/common';
import { ArtCollectionsService } from './art-collections.service';
import { ArtCollectionsController } from './art-collections.controller';

@Module({
  controllers: [ArtCollectionsController],
  providers: [ArtCollectionsService],
})
export class ArtCollectionsModule {}
