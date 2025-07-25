import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtToTagDto {
  @ApiPropertyOptional({
    description: 'Updated UUID of the art piece (optional)',
    example: 'b9a10223-4d3a-4f0d-b3a5-6e5ffbcc3a1f',
  })
  @IsUUID()
  @IsOptional()
  artId?: string;

  @ApiPropertyOptional({
    description: 'Updated UUID of the tag (optional)',
    example: 'd13f1e09-889f-42c0-9347-7a8efb3098e0',
  })
  @IsUUID()
  @IsOptional()
  tagId?: string;
}
