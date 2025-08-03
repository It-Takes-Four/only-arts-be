import { Expose, Transform, Type } from 'class-transformer';
import { BaseResource } from 'src/common/resources/base.resource';

class ArtistResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  artistName: string;

  @Expose()
  isVerified: boolean;

  @Transform(({ obj }) => {
    console.log('Arts count transform - obj._count:', obj._count);
    console.log('Arts count transform - obj.totalArts:', obj.totalArts);
    return obj._count?.arts ?? obj.totalArts ?? 0;
  })
  artistArtsCount: number;

  @Expose()
  @Transform(({ obj }) => {
    console.log('Collections count transform - obj._count:', obj._count);
    console.log('Collections count transform - obj.totalCollections:', obj.totalCollections);
    return obj._count?.collections ?? obj.totalCollections ?? 0;
  })
  artistCollectionsCount: number;

  @Expose()
  @Transform(({ obj }) => {
    console.log('Followers count transform - obj._count:', obj._count);
    console.log('Followers count transform - obj.totalFollowers:', obj.totalFollowers);
    return obj._count?.followers ?? obj.totalFollowers ?? 0;
  })
  artistFollowersCount: number;

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
  @Transform(({ obj }) => {
    if (!obj.artist) return null;
    // Manually create the artist resource to ensure proper transformation
    return {
      id: obj.artist.id,
      artistName: obj.artist.artistName,
      isVerified: obj.artist.isVerified,
      totalArts: obj.artist.artistArtsCount ?? obj.artist.totalArts ?? 0,
      totalCollections: obj.artist.artistCollectionsCount ?? obj.artist.totalCollections ?? 0,
      totalFollowers: obj.artist.artistFollowersCount ?? obj.artist.totalFollowers ?? 0,
      user: obj.artist.user ? {
        username: obj.artist.user.username,
        profilePictureFileId: obj.artist.user.profilePictureFileId
      } : null
    };
  })
  artist: any;

  @Expose()
  @Transform(({ obj }) => obj.artsCount ?? obj._count?.arts ?? 0)
  artsCount: number;

  @Expose()
  isPurchased: boolean;

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make.call(this, data, options);
  }

  static collection(data: any[], options?: { removeNulls?: boolean }): any[] {
    return data.map(item => this.make(item, options));
  }
}
