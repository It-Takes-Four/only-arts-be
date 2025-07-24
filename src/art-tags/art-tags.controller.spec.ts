import { Test, TestingModule } from '@nestjs/testing';
import { ArtTagsController } from './art-tags.controller';
import { ArtTagsService } from './art-tags.service';

describe('ArtTagsController', () => {
  let controller: ArtTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtTagsController],
      providers: [ArtTagsService],
    }).compile();

    controller = module.get<ArtTagsController>(ArtTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
