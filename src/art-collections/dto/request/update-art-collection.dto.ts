import { PartialType } from '@nestjs/swagger';
import { CreateArtCollectionDto } from './create-art-collection.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtCollectionDto extends PartialType(CreateArtCollectionDto) {
  @ApiPropertyOptional({
    description: 'Optional description or notes about the update',
    example: 'Updated to include a new art theme',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
