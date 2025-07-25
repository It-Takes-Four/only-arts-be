import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ArtNftService } from './art-nft.service';
import { CreateArtRequest } from './dto/request/create-art.dto';
import { CreateCollectionRequest } from './dto/request/create-collection.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Art NFT')
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('art-nft')
export class ArtNftController {
    constructor(private readonly artNftService: ArtNftService) { }

    @Post("create-art")
    @ApiOperation({ summary: 'Generate a new art NFT and assign ownership to artist' })
    @ApiBody({ type: CreateArtRequest })
    createArtist(@Body() body: CreateArtRequest) {
        const tokenId = this.artNftService.createArt(body.address);
        return tokenId;
    }

    @Post("create-collection")
    @ApiOperation({ summary: 'Generate a new collection NFT and assign ownership to artist' })
    @ApiBody({ type: CreateCollectionRequest })
    createCollection(@Body() body: CreateCollectionRequest) {
        const tokenId = this.artNftService.createCollection(body.address);
        return tokenId;
    }
}
