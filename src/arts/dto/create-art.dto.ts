import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateArtDto {
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsString()
  description?: string;
}
