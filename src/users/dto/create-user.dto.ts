import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Valid email address used for login and communication.',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Secure password with a minimum of 6 alphanumeric characters.',
    example: 'securePass1',
  })
  @IsAlphanumeric()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Unique username displayed publicly.',
    example: 'creativeUser',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'URL to the user’s profile picture. Optional.',
    example: 'https://cdn.example.com/user/profile.png',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  profilePicture?: string;
}
