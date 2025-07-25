import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtToTagDto {
  @ApiProperty({
    description: 'UUID of the art piece',
    example: 'a3d0b962-22bb-4e33-9999-d2c59a32878d',
  })
  @IsUUID()
  @IsNotEmpty()
  artId: string;

  @ApiProperty({
    description: 'UUID of the tag',
    example: 'd7b65fa0-f8c9-4d0d-88b7-f5cce7ed9942',
  })
  @IsUUID()
  @IsNotEmpty()
  tagId: string;
}
