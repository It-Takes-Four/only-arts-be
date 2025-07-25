import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArtToTagService } from './art-to-tag.service';
import { CreateArtToTagDto } from './dto/create-art-to-tag.dto';
import { UpdateArtToTagDto } from './dto/update-art-to-tag.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Art to Tags')
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('art-tags')
export class ArtToTagController {
  constructor(private readonly service: ArtToTagService) {}

  @Post()
  @ApiOperation({ summary: 'Associate an art piece with a tag' })
  @ApiBody({ type: CreateArtToTagDto })
  create(@Body() dto: CreateArtToTagDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all art-tag associations' })
  findAll() {
    return this.service.findAll();
  }

  @Get('art/:artId')
  @ApiOperation({ summary: 'Get all tags associated with a specific art piece' })
  @ApiParam({ name: 'artId', type: String, description: 'UUID of the art piece' })
  findTagsByArt(@Param('artId') artId: string) {
    return this.service.findTagsByArt(artId);
  }

  @Get('tag/:tagId')
  @ApiOperation({ summary: 'Get all art pieces associated with a specific tag' })
  @ApiParam({ name: 'tagId', type: String, description: 'UUID of the tag' })
  findArtsByTag(@Param('tagId') tagId: string) {
    return this.service.findArtsByTag(tagId);
  }

  @Patch(':artId/:tagId')
  @ApiOperation({ summary: 'Update an art-tag association' })
  @ApiParam({ name: 'artId', description: 'Original art UUID' })
  @ApiParam({ name: 'tagId', description: 'Original tag UUID' })
  @ApiBody({ type: UpdateArtToTagDto })
  update(
    @Param('artId') artId: string,
    @Param('tagId') tagId: string,
    @Body() dto: UpdateArtToTagDto,
  ) {
    return this.service.update(artId, tagId, dto);
  }

  @Delete(':artId/:tagId')
  @ApiOperation({ summary: 'Remove association between an art piece and a tag' })
  @ApiParam({ name: 'artId', type: String, description: 'UUID of the art piece' })
  @ApiParam({ name: 'tagId', type: String, description: 'UUID of the tag' })
  remove(@Param('artId') artId: string, @Param('tagId') tagId: string) {
    return this.service.remove(artId, tagId);
  }
}
