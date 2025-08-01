import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    description: 'New email address to update the user profile.',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
