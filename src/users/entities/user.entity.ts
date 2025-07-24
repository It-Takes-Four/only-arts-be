import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  profilePicture: string;

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Follower, (follower) => follower.user)
  followers: Follower[];
}