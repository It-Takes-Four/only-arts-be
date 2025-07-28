import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateArtDtoRequest } from 'src/arts/dto/request/create-art.dto';
import { Type } from 'class-transformer';

export class CreateWithArtsDtoRequest {
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
    description: 'Art pieces included in the collection',
    type: [CreateArtDtoRequest],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArtDtoRequest)
  arts: CreateArtDtoRequest[];
}
