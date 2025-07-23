import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Art } from 'src/arts/entities/art.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  profilePicture: string;

  @OneToMany(() => Art, (art) => art.user)
  arts: Art[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
