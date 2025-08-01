import { PartialType } from '@nestjs/swagger';
import { CreateArtCollectionDtoRequest } from './create-art-collection.dto';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateArtCollectionDtoRequest extends PartialType(CreateArtCollectionDtoRequest) {
  @ApiPropertyOptional({
    description: 'Optional description or notes about the update',
    example: 'Updated to include a new art theme',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  price?: number;
}
