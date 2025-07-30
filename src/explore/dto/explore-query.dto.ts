import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ExploreQueryDto {
  @ApiProperty({ 
    required: false, 
    description: 'Page number (default: 1)', 
    example: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    required: false, 
    description: 'Number of items per page (default: 20)', 
    example: 20 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by specific tag ID', 
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111' 
  })
  @IsOptional()
  @IsString()
  tagId?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Search query for artwork title or description', 
    example: 'landscape painting' 
  })
  @IsOptional()
  @IsString()
  search?: string;
}
