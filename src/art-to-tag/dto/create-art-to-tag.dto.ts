import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateArtToArtTagDto {
  @IsUUID()
  @IsNotEmpty()
  artId: string;

  @IsUUID()
  @IsNotEmpty()
  tagId: string;
}
