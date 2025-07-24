import { IsNotEmpty, IsString, IsUrl, IsOptional, IsUUID } from 'class-validator';

export class CreateArtDto {
  @IsUUID()
  @IsNotEmpty()
  artistId: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

}
