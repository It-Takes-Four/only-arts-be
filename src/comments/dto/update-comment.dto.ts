import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Updated content of the comment',
    example: 'Actually, I love the lighting even more now.',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
