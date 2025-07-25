import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Password of the user',
    example: 'securePass1',
  })
  password: string;
}
