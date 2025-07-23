import { Controller, Get, Post, Delete, Patch, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> { 
    return this.usersService.findById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> { 
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<void> {  
    return this.usersService.delete(id);
  }
}
