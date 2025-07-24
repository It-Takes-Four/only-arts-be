import { Artist } from "src/artists/entities/artist.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('followers')
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  artistId: string;

  @ManyToOne(() => Artist, (artist) => artist.followers)
  @JoinColumn({ name: 'artistId' })
  artist: Artist;
}