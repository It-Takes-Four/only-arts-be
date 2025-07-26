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
  Request,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Artists')
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('artists')
export class ArtistsController {
  constructor(
    private readonly artistService: ArtistsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  getAllArtists() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by ID' })
  @ApiParam({ name: 'id', description: 'Artist ID (UUID)' })
  getArtistById(@Param('id') id: string) {
    return this.artistService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get artist by associated user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (UUID)' })
  getArtistByUserId(@Param('userId') userId: string) {
    return this.artistService.findByUserId(userId);
  }
  
  @Post('register-as-artist')
  @ApiOperation({ summary: 'Register current user as an artist' })
  async registerAsArtist(@Request() req: AuthenticatedRequest) {
    const user = await this.usersService.findById(req.user.userId);
    if (this.usersService.isArtist(user)) {
      throw new ConflictException('User is already registered as an artist');
    }
    const artist = await this.artistService.create({ userId: req.user.userId });
    
    return {
      message: 'Successfully registered as an artist',
      artist,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update artist information' })
  @ApiParam({ name: 'id', description: 'Artist ID (UUID)' })
  @ApiBody({ type: UpdateArtistDto })
  updateArtist(@Param('id') id: string, @Body() body: UpdateArtistDto) {
    return this.artistService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an artist by ID' })
  @ApiParam({ name: 'id', description: 'Artist ID (UUID)' })
  deleteArtist(@Param('id') id: string) {
    return this.artistService.delete(id);
  }
}
