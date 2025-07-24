import { Test, TestingModule } from '@nestjs/testing';
import { ArtToTagService } from './art-to-tag.service';

describe('ArtToTagService', () => {
  let service: ArtToTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtToTagService],
    }).compile();

    service = module.get<ArtToTagService>(ArtToTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
