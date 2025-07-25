import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtTagDto {
  @ApiPropertyOptional({
    description: 'Updated name of the art tag',
    example: 'Abstract',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  tagName?: string;
}
