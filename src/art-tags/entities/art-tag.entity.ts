import { ArtToTag } from "src/art-to-tag/entities/art-to-tag.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('art_tags')
export class ArtTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tagName: string;

  @OneToMany(() => ArtToTag, (tag) => tag.tag)
  arts: ArtToTag[];
}