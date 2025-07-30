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
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { ArtsService } from './arts.service';
import { CreateArtDtoRequest } from './dto/request/create-art.dto';
import { UpdateArtDtoRequest } from './dto/request/update-art.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Arts')
@Controller('art')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ArtController {
  constructor(private readonly artService: ArtsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all artworks' })
  getAllArt() {
    return this.artService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork' })
  getArtById(@Param('id') id: string) {
    return this.artService.findById(id);
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get all artworks by artist ID' })
  @ApiParam({ name: 'artistId', description: 'UUID of the artist' })
  getArtByArtist(@Param('artistId') artistId: string) {
    return this.artService.findByArtist(artistId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new artwork (with optional tags)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create artwork with image and metadata',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Sungazer' },
        description: { type: 'string', example: 'A surreal sunset over an alien landscape.' },
        tagIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['4e365859-e8d4-4cf7-8091-9acbb7c1dc56'],
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['title', 'description', 'file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  createArt(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateArtDtoRequest,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.artService.createWithTags(body, file, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork to update' })
  @ApiBody({ type: UpdateArtDtoRequest })
  updateArt(@Param('id') id: string, @Body() body: UpdateArtDtoRequest) {
    return this.artService.updateWithTags(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete artwork by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the artwork to delete' })
  deleteArt(@Param('id') id: string) {
    return this.artService.delete(id);
  }
}
