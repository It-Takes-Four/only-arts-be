import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';

@Injectable()
export class FollowersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateFollowerDto, userId: string) {
    return this.prisma.follower.create({
      data: {
        userId, // the follower
        artistId: dto.artistId, // the followed artist
      },
    });
  }

  findAll() {
    return this.prisma.follower.findMany();
  }

  findOne(id: string) {
    return this.prisma.follower.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateFollowerDto) {
    return this.prisma.follower.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.follower.delete({
      where: { id },
    });
  }
}
