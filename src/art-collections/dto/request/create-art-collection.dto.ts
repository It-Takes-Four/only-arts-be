import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtCollectionDtoRequest {
  @ApiProperty({
    description: 'Name of the art collection',
    example: 'Modern Art Showcase',
  })
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty({
    description: 'UUID of the artist creating the collection',
    example: 'b13d5e25-7619-40f6-996e-1c6273e7c9a3',
  })
  @IsUUID()
  @IsNotEmpty()
  artistId: string;
}
