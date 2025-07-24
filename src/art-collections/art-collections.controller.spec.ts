import { Test, TestingModule } from '@nestjs/testing';
import { ArtCollectionsController } from './art-collections.controller';
import { ArtCollectionsService } from './art-collections.service';

describe('ArtCollectionsController', () => {
  let controller: ArtCollectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtCollectionsController],
      providers: [ArtCollectionsService],
    }).compile();

    controller = module.get<ArtCollectionsController>(ArtCollectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
