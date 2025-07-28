import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({ description: 'Name of the artist', example: 'ArtByJohn' })
  @IsString()
  artistName: string;

  @ApiProperty({ description: 'Artist bio', example: 'I paint dreamscapes.' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Whether the artist creates NSFW content', example: false })
  @IsBoolean()
  isNsfw: boolean;
}
