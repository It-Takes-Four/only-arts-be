import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: { artist: true },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            collections: true,
            arts: {
              include: {
                tags: { include: { tag: true } },
                comments: { include: { user: true } },
              },
            },
            feed: true,
            followers: { include: { user: true } },
            notifications: true,
          },
        },
        comments: { include: { art: true } },
        followers: { include: { artist: true } },
        notifications: { include: { artist: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.findByEmailNullable(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByEmailNullable(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(dto.password);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        username: dto.username,
        profilePicture: dto.profilePicture,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findById(id); // throws if not found
    return this.prisma.user.delete({ where: { id } });
  }

  isArtist(user: { artist?: unknown }) {
    return Boolean(user.artist);
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
