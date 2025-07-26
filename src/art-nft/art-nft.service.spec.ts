import { Test, TestingModule } from '@nestjs/testing';
import { ArtNftService } from './art-nft.service';

describe('ArtNftService', () => {
  let service: ArtNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtNftService],
    }).compile();

    service = module.get<ArtNftService>(ArtNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
