import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Artist } from 'src/artists/entities/artist.entity';

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
  artist?: Artist;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
