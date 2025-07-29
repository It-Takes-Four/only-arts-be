import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class FeedsQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Filter feeds by a specific tag ID',
    required: false,
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111',
  })
  @IsOptional()
  @IsUUID()
  tagId?: string;
}
