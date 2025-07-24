// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { Art } from 'src/arts/entities/art.entity';

// @Entity('comments')
export class Comment {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   content: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;

//   @Column('uuid')
//   userId: string;

//   @ManyToOne(() => User, (user) => user.comments)
//   @JoinColumn({ name: 'userId' })
//   user: User;

//   @Column('uuid')
//   artId: string;

//   @ManyToOne(() => Art, (art) => art.comments)
//   @JoinColumn({ name: 'artId' })
//   art: Art;
}
