import { Test, TestingModule } from '@nestjs/testing';
import { ArtTagsService } from './art-tags.service';

describe('ArtTagsService', () => {
  let service: ArtTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtTagsService],
    }).compile();

    service = module.get<ArtTagsService>(ArtTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
