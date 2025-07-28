import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
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
    description: 'Cover image URL of the art collection',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  coverImageUrl: string;

  @ApiProperty({
    description: 'UUID of the artist creating the collection',
    example: 'b13d5e25-7619-40f6-996e-1c6273e7c9a3',
  })
  @IsUUID()
  @IsNotEmpty()
  artistId: string;

  @ApiProperty({
    description: 'UUID of the art piece included in the collection',
    example: '1a5d7d70-c3e0-41a6-b46e-624893d429f2',
  })
  @IsUUID()
  @IsNotEmpty()
  artId: string;
}
