import { Module } from '@nestjs/common';
import { ArtNftController } from './art-nft.controller';
import { ArtNftService } from './art-nft.service';

@Module({
  controllers: [ArtNftController],
  providers: [ArtNftService]
})
export class ArtNftModule {}
