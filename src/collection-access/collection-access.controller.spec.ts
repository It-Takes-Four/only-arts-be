import { Test, TestingModule } from '@nestjs/testing';
import { CollectionAccessController } from './collection-access.controller';

describe('CollectionAccessController', () => {
  let controller: CollectionAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionAccessController],
    }).compile();

    controller = module.get<CollectionAccessController>(CollectionAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
