import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArtDtoRequest {
  @ApiProperty({ description: 'Title of the artwork', example: 'Sungazer.' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the artwork', example: 'A surreal sunset over an alien landscape.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'UUID of the associated artist', example: 'a0d93a2c-8852-4b6a-9a2a-3c9fc9f8a67c' })
  @IsUUID()
  artistId: string;

  @ApiPropertyOptional({ description: 'Optional list of tag UUIDs', example: ['4e365859-e8d4-4cf7-8091-9acbb7c1dc56'] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tagIds?: string[];
}
