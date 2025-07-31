import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ArtsModule } from './arts/arts.module';
import { CommentsModule } from './comments/comments.module';
import { ArtistsModule } from './artists/artists.module';
import { AuthModule } from './auth/auth.module';
import { ArtCollectionsModule } from './art-collections/art-collections.module';
import { ArtTagsModule } from './art-tags/art-tags.module';
import { FollowersModule } from './followers/followers.module';
import { FeedsModule } from './feeds/feeds.module';
import { ExploreModule } from './explore/explore.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ArtToTagModule } from './art-to-tag/art-to-tag.module';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';
import { ArtNftModule } from './art-nft/art-nft.module';
import { CollectionAccessModule } from './collection-access/collection-access.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    PrismaModule,
    SearchModule,
    UsersModule,
    ArtistsModule,
    ArtsModule,
    CommentsModule,
    AuthModule,
    ArtCollectionsModule,
    ArtTagsModule,
    FollowersModule,
    FeedsModule,
    ExploreModule,
    NotificationsModule,
    ArtToTagModule,
    PrismaModule,
    SharedModule,
    ArtNftModule,
    CollectionAccessModule,
    PurchasesModule,
    SearchModule,
  ],
})
export class AppModule {}
