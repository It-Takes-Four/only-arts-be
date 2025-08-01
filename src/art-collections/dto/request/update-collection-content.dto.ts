import {
  IsOptional,
  IsArray,
  IsUUID,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateArtCollectionDtoRequest } from './create-art-collection.dto';

export class UpdateCollectionContentDtoRequest extends PartialType(
  CreateArtCollectionDtoRequest,
) {
  @ApiPropertyOptional({
    description: 'Optional description or notes about the update',
    example: 'Updated to include a new art theme',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  artIds?: string[];
}
