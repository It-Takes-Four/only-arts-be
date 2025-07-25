import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
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

    return users.map(({ password, ...user }) => user);
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

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        profilePicture: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findWithPasswordByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByEmailNullable(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        profilePicture: true,
      },
    });

    return user || null;
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        username: dto.username,
        profilePicture: dto.profilePicture,
      },
    });

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async delete(id: string) {
    await this.findById(id);
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
