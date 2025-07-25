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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Comments')
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  getAllComments() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  getCommentById(@Param('id') id: string) {
    return this.commentService.findById(id);
  }

  @Get('art/:artId')
  @ApiOperation({ summary: 'Get comments by art ID' })
  @ApiParam({ name: 'artId', description: 'Art ID (UUID)' })
  getCommentsByArt(@Param('artId') artId: string) {
    return this.commentService.findByArt(artId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get comments by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (UUID)' })
  getCommentsByUser(@Param('userId') userId: string) {
    return this.commentService.findByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({ type: CreateCommentDto })
  createComment(@Body() body: CreateCommentDto) {
    return this.commentService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  @ApiBody({ type: UpdateCommentDto })
  updateComment(@Param('id') id: string, @Body() body: UpdateCommentDto) {
    return this.commentService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  deleteComment(@Param('id') id: string) {
    return this.commentService.delete(id);
  }
}
