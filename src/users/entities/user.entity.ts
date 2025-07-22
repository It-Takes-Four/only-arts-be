import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Art } from 'src/arts/entities/art.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
}
