import { Test, TestingModule } from '@nestjs/testing';
import { ArtController } from './arts.controller';
import { ArtService } from './arts.service';

describe('ArtController', () => {
  let controller: ArtController;
  let service: ArtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtController],
      providers: [
        {
          provide: ArtService,
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
    service = module.get<ArtService>(ArtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all art items', async () => {
    expect(await controller.findAll()).toEqual([]);
  });

  it('should create a new art item', async () => {
    const dto = { imageUrl: 'img.png', description: 'Artwork' };
    const result = await controller.create(1, dto);
    expect(result).toHaveProperty('user');
    expect(result.user.id).toBe(1);
  });
});
