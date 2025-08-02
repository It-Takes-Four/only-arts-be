import { IsString, IsNotEmpty, MinLength, IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({
    description: 'Search query string',
    example: 'abstract art',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Search query must be at least 1 character long' })
  q: string;
}

export class PaginatedSearchQueryDto extends SearchQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @ApiProperty({
    description: 'Items per page',
    example: 20,
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string = '20';
}
