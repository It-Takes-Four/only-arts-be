import { Module } from '@nestjs/common';
import { CollectionAccessService } from './collection-access.service';
import { CollectionAccessController } from './collection-access.controller';

@Module({
  providers: [CollectionAccessService],
  controllers: [CollectionAccessController]
})
export class CollectionAccessModule {}
