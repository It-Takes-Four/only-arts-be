import { Module } from '@nestjs/common';
import { ArtToTagService } from './art-to-tag.service';
import { ArtToTagController } from './art-to-tag.controller';

@Module({
  controllers: [ArtToTagController],
  providers: [ArtToTagService],
})
export class ArtToTagModule {}
