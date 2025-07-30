import { Module } from '@nestjs/common';
import { CollectionAccessService } from './collection-access.service';

@Module({
  providers: [CollectionAccessService],
})
export class CollectionAccessModule {}
