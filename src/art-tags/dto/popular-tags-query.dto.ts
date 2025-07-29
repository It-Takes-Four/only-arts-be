import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class PopularTagsQueryDto {
  @ApiProperty({
    description: 'Maximum number of popular tags to return',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Search for tags by name (case-insensitive partial match)',
    example: 'abstract',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
