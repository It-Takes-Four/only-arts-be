import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserData } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: this.userInclude(),
    });

    return users.map(({ password, ...user }) =>
      this.convertBigIntToString(user),
    );
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: this.userInclude(),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...safeUser } = user;
    return this.convertBigIntToString(safeUser);
  }

  async findWithPasswordByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? this.convertBigIntToString(user) : null;
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

    return user ? this.convertBigIntToString(user) : null;
  }

  async create(dto: CreateUserData) {
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
    return this.convertBigIntToString(safeUser);
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
    return this.convertBigIntToString(safeUser);
  }

  async delete(id: string) {
    await this.findById(id);
    try {
      const deleted = await this.prisma.user.delete({
        where: { id },
      });

      const { password, ...safeUser } = deleted;
      return this.convertBigIntToString(safeUser);
    } catch (error) {
      if (error.code === 'P2003') {
        throw new InternalServerErrorException(
          'User cannot be deleted due to related records. Consider soft-deleting instead.',
        );
      }
      throw error;
    }
  }

  isArtist(user: { artist?: unknown }) {
    return Boolean(user.artist);
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private userInclude() {
    return {
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
    };
  }

  private convertBigIntToString(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertBigIntToString(item));
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (value instanceof Date) {
            return [key, value.toISOString()];
          }
          return [key, this.convertBigIntToString(value)];
        }),
      );
    } else if (typeof obj === 'bigint') {
      return obj.toString();
    }
    return obj;
  }
}
