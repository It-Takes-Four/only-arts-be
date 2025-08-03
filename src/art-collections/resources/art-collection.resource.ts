import { Expose, Transform, Type } from 'class-transformer';
import { BaseResource } from 'src/common/resources/base.resource';

class ArtistResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  artistName: string;

  @Expose()
  isVerified: boolean;

  @Expose()
  @Transform(({ obj }) => obj.user ? {
    username: obj.user.username,
    profilePictureFileId: obj.user.profilePictureFileId
  } : null)
  user: {
    username: string;
    profilePictureFileId: string | null;
  } | null;
}

export class ArtCollectionResource extends BaseResource {
  constructor(data: any) {
    super(data);
  }

  @Expose()
  id: string;

  @Expose()
  collectionName: string;

  @Expose()
  description: string | null;

  @Expose()
  coverImageFileId: string | null;

  @Expose()
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return null;
    }
    // Handle Prisma Decimal objects
    if (typeof value === 'object' && value.toString) {
      return value.toString();
    }
    // Handle regular numbers or strings
    return value?.toString() ?? null;
  })
  price: string | null;

  @Expose()
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return null;
    }
    // Handle BigInt and other objects with toString method
    if (typeof value === 'object' && value.toString) {
      return value.toString();
    }
    // Handle regular numbers or strings
    return value?.toString() ?? null;
  })
  tokenId: string | null;

  @Expose()
  isPublished: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  artistId: string;

  @Expose()
  @Type(() => ArtistResource)
  artist: ArtistResource | null;

  @Expose()
  @Transform(({ obj }) => obj.artsCount ?? obj._count?.arts ?? 0)
  artsCount: number;

  @Expose()
  @Transform(({ obj }) => obj.artistArtsCount ?? 0)
  artistArtsCount: number;

  @Expose()
  @Transform(({ obj }) => obj.artistCollectionsCount ?? 0)
  artistCollectionsCount: number;

  @Expose()
  @Transform(({ obj }) => obj.artistFollowersCount ?? 0)
  artistFollowersCount: number;

  @Expose()
  isPurchased: boolean;

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make.call(this, data, options);
  }

  static collection(data: any[], options?: { removeNulls?: boolean }): any[] {
    return data.map(item => this.make(item, options));
  }
}
