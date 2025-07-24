import {
  IsString,
  IsUrl,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class UpdateArtDto {
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  artistId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true })
  tagIds?: string[];
}
