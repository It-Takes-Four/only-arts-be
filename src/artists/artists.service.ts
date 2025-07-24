import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    private readonly usersService: UsersService,
  ) {}

  async createForUser(userId: string): Promise<Artist> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const artist = this.artistRepository.create({ user });
    return this.artistRepository.save(artist);
  }

  findAll(): Promise<Artist[]> {
    return this.artistRepository.find({ relations: ['user', 'arts'] });
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: ['user', 'arts'],
    });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }
}
