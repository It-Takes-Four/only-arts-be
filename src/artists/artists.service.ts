import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateArtistDto) {
    // Ensure user exists
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.artist.create({
      data: {
        userId: dto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.artist.findMany({
      include: {
        user: true,
        arts: true,
      },
    });
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        user: true,
        arts: true,
      },
    });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }
}  
