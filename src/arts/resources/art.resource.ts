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
  @Transform(({ obj, value }) => {
    if (!obj.tags || !Array.isArray(obj.tags)) {
      return [];
    }
    
    return obj.tags.map((tagRelation) => {
      // If it's already a simple object with tagId and tagName directly (already transformed)
      if (tagRelation && typeof tagRelation === 'object' && 
          'tagId' in tagRelation && 'tagName' in tagRelation && !('tag' in tagRelation)) {
        return { tagId: tagRelation.tagId, tagName: tagRelation.tagName };
      }
      
      // Handle the original structure with nested tag object
      if (tagRelation && tagRelation.tag && typeof tagRelation.tag === 'object') {
        return {
          tagId: tagRelation.tag.id || tagRelation.tagId || null,
          tagName: tagRelation.tag.tagName || tagRelation.tagName || null
        };
      }
      
      // Fallback - try to extract what we can
      return {
        tagId: tagRelation?.tagId || null,
        tagName: tagRelation?.tagName || null
      };
    });
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
