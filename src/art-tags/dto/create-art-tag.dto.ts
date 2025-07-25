import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtTagDto {
  @ApiProperty({
    description: 'Name of the art tag',
    example: 'AI Art',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  tagName: string;
}
