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
import { NotificationsModule } from './notifications/notifications.module';
import { ArtToTagModule } from './art-to-tag/art-to-tag.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ArtistsModule,
    ArtsModule,
    CommentsModule,
    AuthModule,
    ArtCollectionsModule,
    ArtTagsModule,
    FollowersModule,
    FeedsModule,
    NotificationsModule,
    ArtToTagModule,
    PrismaModule,
  ],
})
export class AppModule {}
