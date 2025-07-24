import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateArtTagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  tagName: string;
}
