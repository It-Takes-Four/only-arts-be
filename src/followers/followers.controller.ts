import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  Request,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { FollowersService } from './followers.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Followers')
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':artistId')
  @ApiOperation({ summary: 'Follow an artist' })
  @ApiParam({ name: 'artistId', description: 'UUID of the artist to follow' })
  async followArtist(
    @Param('artistId') artistId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    if (userId === artistId) {
      throw new ConflictException("You can't follow yourself");
    }

    return this.followersService.follow(userId, artistId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all follower relationships' })
  getAllFollowers() {
    return this.followersService.findAll();
  }

  @Get('follow/:id')
  @ApiOperation({ summary: 'Get a specific follow record by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the follow record' })
  getFollowById(@Param('id') id: string) {
    return this.followersService.findById(id);
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get all followers for a given artist' })
  @ApiParam({ name: 'artistId', description: 'UUID of the artist' })
  getFollowersByArtist(@Param('artistId') artistId: string) {
    return this.followersService.findByArtist(artistId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all artists followed by a user' })
  @ApiParam({ name: 'userId', description: 'UUID of the user' })
  getFollowingByUser(@Param('userId') userId: string) {
    return this.followersService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a follower relationship' })
  @ApiParam({ name: 'id', description: 'UUID of the follow record to update' })
  @ApiBody({ type: UpdateFollowerDto })
  update(@Param('id') id: string, @Body() updateFollowerDto: UpdateFollowerDto) {
    return this.followersService.update(id, updateFollowerDto);
  }

  @Delete(':artistId/unfollow')
  @ApiOperation({ summary: 'Unfollow an artist' })
  @ApiParam({ name: 'artistId', description: 'UUID of the artist to unfollow' })
  async unfollowArtist(
    @Param('artistId') artistId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.followersService.unfollow(userId, artistId);
  }

}
