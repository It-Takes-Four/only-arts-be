import { Module } from '@nestjs/common';
import { ArtTagsService } from './art-tags.service';
import { ArtTagsController } from './art-tags.controller';

@Module({
  controllers: [ArtTagsController],
  providers: [ArtTagsService],
})
export class ArtTagsModule {}
