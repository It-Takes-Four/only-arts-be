import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFeedDto {
  @ApiPropertyOptional({
    description: 'Updated title of the feed post',
    example: 'Updated Title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated content of the feed post',
    example: 'Updated content with new details about the art.',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
