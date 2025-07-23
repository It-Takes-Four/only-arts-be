import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity('arts')
export class Art {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  datePosted: Date;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User, (user) => user.arts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.art)
  comments: Comment[];
}
