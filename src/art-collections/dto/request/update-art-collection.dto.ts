import { PartialType } from '@nestjs/swagger';
import { CreateArtCollectionDtoRequest } from './create-art-collection.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtCollectionDtoRequest extends PartialType(CreateArtCollectionDtoRequest) {
  @ApiPropertyOptional({
    description: 'Optional description or notes about the update',
    example: 'Updated to include a new art theme',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
