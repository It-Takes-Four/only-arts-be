import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Art } from 'src/arts/entities/art.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Art)
    private artRepo: Repository<Art>,
  ) {}

  async create(createDto: CreateCommentDto): Promise<Comment> {
    const user = await this.userRepo.findOneBy({ id: createDto.userId });
    const art = await this.artRepo.findOneBy({ id: createDto.artId });

    if (!user || !art) {
      throw new Error('User or Art not found');
    }

    const comment = this.commentRepo.create({
      content: createDto.content,
      user,
      art,
    });

    return this.commentRepo.save(comment);
  }
}
