import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'New email address to update the user profile.',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password with at least 6 characters.',
    example: 'updatedPass456',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'New display name for the user.',
    example: 'updatedUsername',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Updated URL of the profile picture.',
    example: 'https://cdn.example.com/user/new-profile.jpg',
  })
  @IsOptional()
  @IsUrl()
  profilePicture?: string;
}
