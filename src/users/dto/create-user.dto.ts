import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email of the user',
    example: 'admin@admin.com',
  })
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(6)
  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Username of the user',
    example: 'adminUser',
  })
  username: string;

  @IsOptional()
  @IsUrl()
  profilePicture?: string;
}
