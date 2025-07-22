import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body);
  }
}
