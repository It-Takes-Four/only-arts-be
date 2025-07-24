import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateArtDto {
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  artistId: string;

  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true }) 
  tagIds?: string[];
}
