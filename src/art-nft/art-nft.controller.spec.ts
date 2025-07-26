import { Test, TestingModule } from '@nestjs/testing';
import { ArtNftController } from './art-nft.controller';

describe('ArtNftController', () => {
  let controller: ArtNftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtNftController],
    }).compile();

    controller = module.get<ArtNftController>(ArtNftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
