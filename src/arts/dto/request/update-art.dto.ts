import {
  IsString,
  IsUrl,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtDto {
  @ApiPropertyOptional({ description: 'Updated image URL', example: 'https://example.com/new-image.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Updated artwork description', example: 'A revised version of the surreal sunset.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Updated artist UUID', example: '8d36e0a0-8f15-4f2e-9cc1-cf1c7e7b774f' })
  @IsOptional()
  @IsUUID()
  artistId?: string;

  @ApiPropertyOptional({ description: 'Updated list of tag UUIDs', example: ['4e365859-e8d4-4cf7-8091-9acbb7c1dc56'] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tagIds?: string[];
}
