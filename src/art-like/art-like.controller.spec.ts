import { Test, TestingModule } from '@nestjs/testing';
import { ArtLikeController } from './art-like.controller';
import { ArtLikeService } from './art-like.service';

describe('ArtLikeController', () => {
  let controller: ArtLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtLikeController],
      providers: [ArtLikeService],
    }).compile();

    controller = module.get<ArtLikeController>(ArtLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
