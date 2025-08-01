import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  ConflictException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

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
  @ApiOperation({ summary: 'Get all artists with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  getAllArtists(@Query() pagination: PaginationQueryDto) {
    return this.artistService.findAll(pagination);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current logged-in user as artist' })
  async getMyArtistProfile(@Request() req: AuthenticatedRequest) {
    return this.artistService.findByUserId(req.user.userId);
  }

  @Post('register-as-artist')
  @ApiOperation({ summary: 'Register current user as an artist' })
  async registerAsArtist(
    @Request() req: AuthenticatedRequest,
    @Body() createArtistDto: CreateArtistDto,
  ) {
    const userId = req.user.userId;

    const user = await this.usersService.findById(userId);
    if (this.usersService.isArtist(user)) {
      throw new ConflictException('User is already registered as an artist');
    }

    const artist = await this.artistService.create(createArtistDto, userId);

    return {
      message: 'Successfully registered as an artist',
      artist,
    };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current artist profile' })
  @ApiBody({ type: UpdateArtistDto })
  updateMyArtistProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateArtistDto,
  ) {
    return this.artistService.updateByUserId(req.user.userId, body);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current artist account' })
  deleteMyArtistProfile(@Request() req: AuthenticatedRequest) {
    return this.artistService.deleteByUserId(req.user.userId);
  }
}
