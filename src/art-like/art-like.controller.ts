import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { ArtLikeService } from './art-like.service';
import { LikeArtDtoRequest } from './dto/request/like-art.dto';
import { CheckUserArtLikeDtoRequest } from './dto/request/check-user-art-like.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';

@ApiTags('Art Like')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('art-like')
export class ArtLikeController {
  constructor(private readonly artLikeService: ArtLikeService) { }

  @Post('like')
  async likeArt(@Body() dto: LikeArtDtoRequest) {
    return await this.artLikeService.likeArt(dto);
  }

  @Post('unlike')
  async unlikeArt(@Body() dto: LikeArtDtoRequest) {
    return await this.artLikeService.unlikeArt(dto);
  }

  @Get('check')
  async checkUserArtLike(@Query() dto: CheckUserArtLikeDtoRequest) {
    const hasLiked = await this.artLikeService.checkUserArtLike(dto.userId, dto.artId);
    return { hasLiked };
  }

  @Get('me/has-liked/:artId')
  @ApiOperation({ summary: 'Check if current user has liked an art' })
  @ApiParam({ name: 'artId', type: String, description: 'Art ID' })
  async getMyNotifications(
    @Request() req: AuthenticatedRequest,
    @Param('artId') artId: string,
  ) {
    const result = await this.artLikeService.checkUserArtLike(req.user.userId, artId);
    return result
  }

  @Get('count/:artId')
  async getArtLikeCount(@Param('artId') artId: string) {
    const count = await this.artLikeService.getArtLikeCount(artId);
    return { artId, likeCount: count };
  }

  @Get('likers/:artId')
  async getArtLikers(@Param('artId') artId: string) {
    const likers = await this.artLikeService.getArtLikers(artId);
    return { artId, likers };
  }

}
