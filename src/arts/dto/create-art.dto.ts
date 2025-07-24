import { IsNotEmpty, IsString, IsUrl, IsOptional, IsUUID } from 'class-validator';

export class CreateArtDto {
  @IsUUID()
  @IsNotEmpty()
  artistId: string;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsString()
  description?: string;
}
