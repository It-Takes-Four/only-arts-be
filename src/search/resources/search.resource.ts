import { Expose, Transform, Type } from 'class-transformer';
import { BaseResource } from 'src/common/resources/base.resource';

class SearchArtistResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  artistName: string;

  @Expose()
  isVerified: boolean;

  @Expose()
  totalFollowers: number;

  @Expose()
  totalArts: number;

  @Expose()
  totalCollections: number;

  @Expose()
  bio: string | null;

  @Expose()
  @Transform(({ obj }) => obj.user ? {
    username: obj.user.username,
    profilePictureFileId: obj.user.profilePictureFileId
  } : null)
  user: {
    username: string;
    profilePictureFileId: string | null;
  } | null;

  toArray(options?: { removeNulls?: boolean }): any {
    return this.transform(options);
  }

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make(data, options);
  }

  static collection(data: any[], options?: { removeNulls?: boolean }): any[] {
    return data.map(item => this.make(item, options));
  }
}

class SearchCollectionResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  collectionName: string;

  @Expose()
  description: string | null;

  @Expose()
  coverImageFileId: string | null;

  @Expose()
  price: string | null;

  @Expose()
  isPublished: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => SearchArtistResource)
  artist: SearchArtistResource;

  @Expose()
  @Transform(({ obj }) => obj.arts ? obj.arts.length : 0)
  artsCount: number;

  toArray(options?: { removeNulls?: boolean }): any {
    return this.transform(options);
  }

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make(data, options);
  }

  static collection(data: any[], options?: { removeNulls?: boolean }): any[] {
    return data.map(item => this.make(item, options));
  }
}

class SearchArtResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string | null;

  @Expose()
  imageFileId: string;

  @Expose()
  datePosted: Date;

  @Expose()
  likesCount: number;

  @Expose()
  @Type(() => SearchArtistResource)
  artist: SearchArtistResource;

  @Expose()
  @Transform(({ obj }) => {
    if (!obj.tags || !Array.isArray(obj.tags)) {
      return [];
    }
    
    return obj.tags.map((tagRelation) => {
      // Handle the structure with nested tag object
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

  toArray(options?: { removeNulls?: boolean }): any {
    return this.transform(options);
  }

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make(data, options);
  }

  static collection(data: any[], options?: { removeNulls?: boolean }): any[] {
    return data.map(item => this.make(item, options));
  }
}

export class SearchAllResource extends BaseResource {
  @Expose()
  @Type(() => SearchArtResource)
  arts: SearchArtResource[];

  @Expose()
  @Type(() => SearchCollectionResource)
  collections: SearchCollectionResource[];

  @Expose()
  @Type(() => SearchArtistResource)
  artists: SearchArtistResource[];

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make(data, options);
  }
}

export { SearchArtResource, SearchCollectionResource, SearchArtistResource };
