import { Artist } from "src/artists/entities/artist.entity";
import { Art } from "src/arts/entities/art.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('art_collections')
export class ArtCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  collectionName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('uuid')
  artistId: string;

  @ManyToOne(() => Artist, (artist) => artist.collections)
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column('uuid')
  artId: string;

  @ManyToOne(() => Art, (art) => art.collections)
  @JoinColumn({ name: 'artId' })
  art: Art;
}