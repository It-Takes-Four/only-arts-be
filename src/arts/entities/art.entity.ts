import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Artist } from 'src/artists/entities/artist.entity';

@Entity('arts')
export class Art {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column({ default: () => 'NOW()' })
  datePosted: Date;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Artist, (artist) => artist.arts)
  artist: Artist;

  @OneToMany(() => Comment, (comment) => comment.art)
  comments: Comment[];
}
