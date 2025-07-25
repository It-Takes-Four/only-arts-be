import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateFollowerDto } from './create-follower.dto';
import { IsUUID, IsOptional } from 'class-validator';

export class UpdateFollowerDto extends PartialType(CreateFollowerDto) {
  @ApiPropertyOptional({
    description: 'ID of the user who is following the artist',
    format: 'uuid',
    example: 'a3b4f5d6-7890-1234-5678-90abcdef1234',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'ID of the artist being followed',
    format: 'uuid',
    example: 'b1c2d3e4-5678-9876-5432-10fedcba4321',
  })
  @IsUUID()
  @IsOptional()
  artistId?: string;
}
