import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Art } from 'src/arts/entities/art.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Art])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
