import { Test, TestingModule } from '@nestjs/testing';
import { ArtCollectionsService } from './art-collections.service';

describe('ArtCollectionsService', () => {
  let service: ArtCollectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtCollectionsService],
    }).compile();

    service = module.get<ArtCollectionsService>(ArtCollectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
