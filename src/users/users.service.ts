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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: this.userInclude(),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findByIdMinimal(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        artist: {
          select: {
            id: true,
            artistName: true,
            bio: true,
            walletAddress: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findWithPasswordByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ?? null;
  }

  async findByEmailNullable(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        profilePictureFileId: true,
      },
    });

    return user ?? null;
  }

  async create(dto: CreateUserData) {
    const hashedPassword = await this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        username: dto.username,
        profilePictureFileId: dto.profilePicture,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async delete(id: string) {
    await this.findById(id);
    try {
      const deleted = await this.prisma.user.delete({
        where: { id },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = deleted;
      return safeUser;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
}
