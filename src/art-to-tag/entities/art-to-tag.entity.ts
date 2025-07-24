import { ArtTag } from "src/art-tags/entities/art-tag.entity";
import { Art } from "src/arts/entities/art.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('art_to_art_tag')
export class ArtToTag {
  @PrimaryColumn('uuid')
  artId: string;

  @PrimaryColumn('uuid')
  tagId: string;

  @ManyToOne(() => Art, (art) => art.tags)
  @JoinColumn({ name: 'artId' })
  art: Art;

  @ManyToOne(() => ArtTag, (tag) => tag.arts)
  @JoinColumn({ name: 'tagId' })
  tag: ArtTag;
}
