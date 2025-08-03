import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateArtDtoRequest {
  @ApiProperty({ description: 'Title of the artwork', example: 'Sungazer.' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the artwork', example: 'A surreal sunset over an alien landscape.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Optional list of tag UUIDs', example: ['4e365859-e8d4-4cf7-8091-9acbb7c1dc56'] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @Transform(({ value }) => {
    // Convert single string to array
    if (typeof value === 'string') {
      return [value];
    }
    // Return as-is if already an array or undefined
    return value;
  })
  tagIds?: string[];
}
