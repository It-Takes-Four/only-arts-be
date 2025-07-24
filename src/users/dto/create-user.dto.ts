import { IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsUrl()
  profilePicture?: string;
}
