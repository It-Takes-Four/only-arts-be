import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Art } from 'src/arts/entities/art.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'userId' }) 
  user: User;

  @OneToMany(() => Art, (art) => art.artist)
  arts: Art[];
}
