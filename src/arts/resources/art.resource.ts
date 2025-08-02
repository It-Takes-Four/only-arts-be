import { Expose, Transform, Type } from 'class-transformer';
import { BaseResource } from 'src/common/resources/base.resource';

class ArtCollectionResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  collectionId: string;

  @Expose()
  artId: string;
}

class CommentResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  userId: string;

  @Expose()
  artId: string;
}

class ArtistResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  artistName: string;

  @Expose()
  isVerified: boolean;

  @Expose()
  @Transform(({ obj }) => obj.user ? {
    profilePictureFileId: obj.user.profilePictureFileId
  } : null)
  user: {
    profilePictureFileId: string | null;
  } | null;
}

export class ArtResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ value }) => value?.toString() ?? null)
  tokenId: string | null;

  @Expose()
  title: string;

  @Expose()
  description: string | null;

  @Expose()
  imageFileId: string;

  @Expose()
  datePosted: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  artistId: string;

  @Expose()
  @Type(() => ArtistResource)
  artist: ArtistResource;

  @Expose()
  @Transform(({ obj }) => {
    if (!obj.tags || !Array.isArray(obj.tags)) return [];
    return obj.tags.map(tagRelation => ({
      tagId: tagRelation.tag?.id || null,
      tagName: tagRelation.tag?.tagName || null
    }));
  })
  tags: { tagId: string | null; tagName: string | null }[];

  @Expose()
  @Type(() => ArtCollectionResource)
  collections: ArtCollectionResource[];

  // Only include comments if they exist (for individual art view)
  @Expose()
  @Type(() => CommentResource)
  comments?: CommentResource[];

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make.call(this, data, options);
  }

  static collection(data: any[], options?: { removeNulls?: boolean }): any[] {
    return data.map(item => this.make(item, options));
  }
}
