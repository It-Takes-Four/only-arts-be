import { Expose, Type } from 'class-transformer';
import { BaseResource } from '../../common/resources/base.resource';
import { AuditMixin } from '../../common/mixins/audit.mixin';

class UserResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  profilePictureFileId: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class ArtistResource extends AuditMixin(BaseResource) {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  artistName: string;

  @Expose()
  isNsfw: boolean;

  @Expose()
  bio: string | null;

  @Expose()
  walletAddress: string | null;

  @Expose()
  totalFollowers: number;

  @Expose()
  totalArts: number;

  @Expose()
  totalCollections: number;

  @Expose()
  isVerified: boolean;

  @Expose()
  @Type(() => UserResource)
  user?: UserResource;

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make.call(this, data, options);
  }

  static collection(data: any[], options?: { removeNulls?: boolean }): any[] {
    return data.map(item => this.make(item, options));
  }
}
