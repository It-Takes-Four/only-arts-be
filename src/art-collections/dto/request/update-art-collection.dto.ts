import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateArtCollectionDtoRequest {
  @ApiPropertyOptional({
    description: 'Name of the art collection',
    example: 'Updated Modern Art Showcase',
  })
  @IsString()
  @IsOptional()
  collectionName?: string;

  @ApiPropertyOptional({
    description: 'Description of the art collection',
    example: 'A curated collection of contemporary modern art pieces',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Price of the art collection',
    example: 150,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
}
