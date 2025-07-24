import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtDto } from './dto/create-art.dto';

@Injectable()
export class ArtService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.art.findMany({
      include: {
        artist: true,
        comments: true,
      },
    });
  }

  async create(dto: CreateArtDto, userId: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: dto.artistId },
      include: { user: true },
    });

    if (!artist) throw new NotFoundException('Artist not found');
    if (artist.user.id !== userId)
      throw new UnauthorizedException('You do not own this artist profile');

    return this.prisma.art.create({
      data: {
        imageUrl: dto.imageUrl,
        description: dto.description ?? "",
        artistId: dto.artistId,
      },
    });
  }
}  