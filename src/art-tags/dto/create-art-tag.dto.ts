import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArtTagDto {
  @IsString()
  @IsNotEmpty()
  tagName: string;
}
