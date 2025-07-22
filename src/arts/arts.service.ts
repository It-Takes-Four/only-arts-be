import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateArtDto } from './dto/create-art.dto';

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art)
    private artRepository: Repository<Art>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Art[]> {
    return this.artRepository.find({ relations: ['user', 'comments'] });
  }

  async create(dto: CreateArtDto, userId: number): Promise<Art> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const art = this.artRepository.create({ ...dto, user });
    return this.artRepository.save(art);
  }
}