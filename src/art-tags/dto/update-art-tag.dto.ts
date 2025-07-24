import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateArtTagDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  tagName?: string;
}