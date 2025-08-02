import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateArtCollectionDtoRequest {
  @ApiProperty({
    description: 'Name of the art collection',
    example: 'Modern Art Showcase',
  })
  @IsString()
  @IsNotEmpty()
  collectionName: string;
}
