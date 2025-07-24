import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  getAllComments() {
    return this.commentService.findAll();
  }

  @Get(':id')
  getCommentById(@Param('id') id: string) {
    return this.commentService.findById(id);
  }

  @Get('art/:artId')
  getCommentsByArt(@Param('artId') artId: string) {
    return this.commentService.findByArt(artId);
  }

  @Get('user/:userId')
  getCommentsByUser(@Param('userId') userId: string) {
    return this.commentService.findByUser(userId);
  }

  @Post()
  createComment(@Body() body: CreateCommentDto) {
    return this.commentService.create(body);
  }

  @Patch(':id')
  updateComment(@Param('id') id: string, @Body() body: UpdateCommentDto) {
    return this.commentService.update(id, body);
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string) {
    return this.commentService.delete(id);
  }
}
