import { Test, TestingModule } from '@nestjs/testing';
import { ArtLikeService } from './art-like.service';

describe('ArtLikeService', () => {
  let service: ArtLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtLikeService],
    }).compile();

    service = module.get<ArtLikeService>(ArtLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
