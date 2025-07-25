import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedDto {
  @ApiProperty({
    description: 'UUID of the artist creating the feed',
    example: 'd138cbb8-e3a5-49a9-b6e3-110a35b92ef7',
  })
  @IsUUID()
  @IsNotEmpty()
  artistId: string;

  @ApiProperty({
    description: 'Title of the feed post',
    example: 'My Latest Work',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the feed post',
    example: 'Check out my new painting that explores surreal dreamscapes.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
