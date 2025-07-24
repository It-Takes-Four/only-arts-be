import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateArtCollectionDto {
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @IsUUID()
  @IsNotEmpty()
  artistId: string;

  @IsUUID()
  @IsNotEmpty()
  artId: string;
}

// export class CreateArtCollectionDto {
//   collectionName: string;
//   artistId: string;
//   artId: string;
// }