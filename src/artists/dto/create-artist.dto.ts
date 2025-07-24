import { IsUUID } from 'class-validator';

export class CreateArtistDto {
  @IsUUID()
  userId: string;
}
