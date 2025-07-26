import { Module } from '@nestjs/common';
import { ArtNftService } from './art-nft.service';

@Module({
  controllers: [],
  providers: [ArtNftService]
})
export class ArtNftModule {}
