import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Column } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Art } from 'src/arts/entities/art.entity';
import { ArtCollection } from 'src/art-collections/entities/art-collection.entity';
import { Feed } from 'src/feeds/entities/feed.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @OneToOne(() => User, (user) => user.artist)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Art, (art) => art.artist)
  arts: Art[];

  @OneToMany(() => ArtCollection, (collection) => collection.artist)
  collections: ArtCollection[];

  @OneToMany(() => Feed, (feed) => feed.artist)
  feed: Feed[];

  @OneToMany(() => Follower, (follower) => follower.artist)
  followers: Follower[];

  @OneToMany(() => Notification, (notification) => notification.artist)
  notifications: Notification[];
}
