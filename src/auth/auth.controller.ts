import { Controller, Post, Body, UnauthorizedException, ConflictException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { NonceRequest } from './dto/request/nonce.dto';
import { VerifyRequest } from './dto/request/verify.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('nonce')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ 
    type: NonceRequest,
    description: 'User wallet address'
  })
  async generateNonce(@Body() body: NonceRequest) {
    const nonce = this.authService.generateNonce(body.address);
    return { nonce };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ 
    type: VerifyRequest,
    description: 'User wallet address'
  })
  async verifySignature(@Body() request: VerifyRequest) {
    return await this.authService.verifySignature(request);
  }

  @Post('login')
  @ApiBody({ 
    type: LoginDto,
    description: 'User login credentials'
  })
  async login(@Body() body: LoginDto) {
    const user = await this.usersService.findByEmail(body.email);
    const isPasswordValid = user && await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateJwt(user);
  }

  @Post('register')
  @ApiBody({ type: CreateUserDto, description: 'User registration data' })
  async register(@Body() body: CreateUserDto) {
    const existingUser = await this.usersService.findByEmailNullable(body.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const newUser = await this.usersService.create(body);
    return this.authService.generateJwt(newUser);
  }
}
