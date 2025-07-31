import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckUserArtLikeDtoRequest {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  artId: string;
}