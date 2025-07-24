import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateArtDto } from './dto/create-art.dto';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art)
    private artRepository: Repository<Art>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>, 
  ) {}

  async findAll(): Promise<Art[]> {
    return this.artRepository.find({
      relations: ['artist', 'comments'], 
    });
  }

  async create(createArtDto: CreateArtDto): Promise<Art> {
    const artist = await this.artistRepository.findOne({
      where: { id: createArtDto.artistId },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const art = this.artRepository.create({
      imageUrl: createArtDto.imageUrl,
      description: createArtDto.description,
      artist,
    });

    return this.artRepository.save(art);
  }
}