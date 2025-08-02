import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
}
