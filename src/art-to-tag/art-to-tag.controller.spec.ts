import { Test, TestingModule } from '@nestjs/testing';
import { ArtToTagController } from './art-to-tag.controller';
import { ArtToTagService } from './art-to-tag.service';

describe('ArtToTagController', () => {
  let controller: ArtToTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtToTagController],
      providers: [ArtToTagService],
    }).compile();

    controller = module.get<ArtToTagController>(ArtToTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
