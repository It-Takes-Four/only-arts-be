import { IsNotEmpty, IsNumber, IsString, Min, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateArtCollectionDtoRequest {
  @ApiProperty({
    description: 'Name of the art collection',
    example: 'Modern Art Showcase',
  })
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiPropertyOptional({
    description: 'Description of the art collection',
    example: 'A curated collection of modern art pieces',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Price of the art collection',
    example: 100,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price?: number;
}
