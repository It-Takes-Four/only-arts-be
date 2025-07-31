import { Expose, Type } from 'class-transformer';
import { BaseResource } from '../../common/resources/base.resource';
import { AuditMixin } from '../../common/mixins/audit.mixin';

class ArtistProfileResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  artistName: string;

  @Expose()
  bio: string | null;

  @Expose()
  walletAddress: string | null;

  @Expose()
  isVerified: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class UserProfileResource extends AuditMixin(BaseResource) {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string | null;

  @Expose()
  profilePictureFileId: string | null;

  @Expose()
  @Type(() => ArtistProfileResource)
  artist?: ArtistProfileResource | null;

  static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make.call(this, data, options);
  }

  static collection(data: any[], options?: { removeNulls?: boolean }): any[] {
    return data.map(item => this.make(item, options));
  }
}
