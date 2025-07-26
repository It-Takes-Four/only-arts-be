import { Test, TestingModule } from '@nestjs/testing';
import { CollectionAccessService } from './collection-access.service';

describe('CollectionAccessService', () => {
  let service: CollectionAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionAccessService],
    }).compile();

    service = module.get<CollectionAccessService>(CollectionAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
