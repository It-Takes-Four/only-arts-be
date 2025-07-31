import { Test, TestingModule } from '@nestjs/testing';
import { ArtController } from './arts.controller';
import { ArtsService } from './arts.service';

describe('ArtController', () => {
  let controller: ArtController;
  let service: ArtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtController],
      providers: [
        {
          provide: ArtsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockImplementation((dto, userId) => ({
              id: 1,
              ...dto,
              user: { id: userId },
              datePosted: new Date(),
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<ArtController>(ArtController);
    service = module.get<ArtsService>(ArtsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all art items', async () => {
    expect(await controller.getAllArt()).toEqual([]);
  });
});
