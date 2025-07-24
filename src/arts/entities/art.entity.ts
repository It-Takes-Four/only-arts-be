// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
// import { Comment } from 'src/comments/entities/comment.entity';
// import { Artist } from 'src/artists/entities/artist.entity';
// import { ArtToTag } from 'src/art-to-tag/entities/art-to-tag.entity';
// import { ArtCollection } from 'src/art-collections/entities/art-collection.entity';

// @Entity('arts')
// export class Art {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   imageUrl: string;

//   @Column()
//   description: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   datePosted: Date;

//   @Column('uuid')
//   artistId: string;

//   @ManyToOne(() => Artist, (artist) => artist.arts)
//   @JoinColumn({ name: 'artistId' })
//   artist: Artist;

//   @OneToMany(() => Comment, (comment) => comment.art)
//   comments: Comment[];

//   @OneToMany(() => ArtToTag, (tag) => tag.art)
//   tags: ArtToTag[];

//   @OneToMany(() => ArtCollection, (collection) => collection.art)
//   collections: ArtCollection[];
// }

export class Art {}