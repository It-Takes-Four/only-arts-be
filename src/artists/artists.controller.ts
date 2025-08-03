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
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UpdateWalletAddressDto } from './dto/update-wallet-address.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ArtistResource } from './resources/artist.resource';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Artists')
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('artists')
export class ArtistsController {
  constructor(
    private readonly artistService: ArtistsService,
    private readonly usersService: UsersService,
  ) { }

  @Get(':artistId/wallet')
  @ApiOperation({ summary: 'Get artist wallet address by artist ID' })
  @ApiParam({ name: 'artistId', description: 'Artist ID', type: 'string' })
  async getArtistWalletAddress(@Param('artistId') artistId: string) {
    const artist = await this.artistService.findByIdSimple(artistId);
    return {
      walletAddress: artist.walletAddress,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current logged-in user as artist' })
  async getMyArtistProfile(@Request() req: AuthenticatedRequest) {
    const artist = await this.artistService.findByUserIdSimple(req.user.userId);
    return ArtistResource.make(artist);
  }

  @Get(':artistId')
  @ApiOperation({ summary: 'Get artist by ID' })
  @ApiParam({ name: 'artistId', description: 'Artist ID', type: 'string' })
  async getArtistById(@Param('artistId') artistId: string) {
    const artist = await this.artistService.findByIdSimple(artistId);
    return ArtistResource.make(artist);
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
  async updateMyArtistProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateArtistDto,
  ) {
    const artist = await this.artistService.updateByUserId(req.user.userId, body);
    return ArtistResource.make(artist);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current artist account' })
  deleteMyArtistProfile(@Request() req: AuthenticatedRequest) {
    return this.artistService.deleteByUserId(req.user.userId);
  }

  @Get('me/wallet')
  @ApiOperation({ summary: 'Get current artist wallet address' })
  async getMyWalletAddress(@Request() req: AuthenticatedRequest) {
    const artist = await this.artistService.findByUserIdSimple(req.user.userId);
    return {
      walletAddress: artist.walletAddress,
    };
  }

  @Patch('me/wallet')
  @ApiOperation({ summary: 'Update current artist wallet address' })
  @ApiBody({ type: UpdateWalletAddressDto })
  async updateMyWalletAddress(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateWalletAddressDto,
  ) {
    const artist = await this.artistService.updateWalletAddress(req.user.userId, body.walletAddress);
    return {
      message: 'Wallet address updated successfully',
      walletAddress: artist.walletAddress,
    };
  }
}
