import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateArtCollectionDto {
  @IsString()
  @IsNotEmpty()
  collectionName?: string;
}
