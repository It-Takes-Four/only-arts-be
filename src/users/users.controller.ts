import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user email' })
  @ApiBody({
    description: 'User email data',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'New email address',
          example: 'newemail@example.com',
        },
      },
    },
  })
  async updateCurrentUser(
    @Body() body: UpdateUserProfileDto,
    @Request() req,
  ) {
    try {
      return await this.usersService.update(req.user.userId, body);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user profile';
      throw new BadRequestException(message);
    }
  }

  @Patch('me/profile-picture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile picture file',
    schema: {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'string',
          format: 'binary',
          description: 'Profile picture file (JPEG, PNG, GIF, WebP - max 10MB)',
        },
      },
      required: ['profilePicture'],
    },
  })
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async updateProfilePicture(
    @UploadedFile() profilePicture: Express.Multer.File,
    @Request() req,
  ) {
    if (!profilePicture) {
      throw new BadRequestException('Profile picture file is required');
    }

    try {
      return await this.usersService.updateProfilePicture(req.user.userId, profilePicture);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile picture';
      throw new BadRequestException(message);
    }
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete current user account' })
  async deleteCurrentUser(@Request() req) {
    return this.usersService.delete(req.user.userId);
  }
}
