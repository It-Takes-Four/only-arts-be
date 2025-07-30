import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtCollectionDtoRequest {
  @ApiProperty({
    description: 'Name of the art collection',
    example: 'Modern Art Showcase',
  })
  @IsString()
  @IsNotEmpty()
  collectionName: string;
}
