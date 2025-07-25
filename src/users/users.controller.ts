import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
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

  @Get('email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiQuery({
    name: 'email',
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  getUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getUserProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'User ID to update' })
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto, @Request() req,) {
    if (id !== req.user.userId) {
      throw new UnauthorizedException('You can only update your own account');
    }

    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID to delete' })
  async deleteUser(@Param('id') id: string, @Request() req) {
    if (id !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own account');
    }

    return this.usersService.delete(id);
  }

}
