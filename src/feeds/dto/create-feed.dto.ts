import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFeedDto {
  @IsUUID()
  @IsNotEmpty()
  artistId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
