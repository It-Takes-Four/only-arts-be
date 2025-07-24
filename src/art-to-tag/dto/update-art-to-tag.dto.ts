import { PartialType } from '@nestjs/swagger';
import { CreateArtToArtTagDto } from './create-art-to-tag.dto';

export class UpdateArtToTagDto extends PartialType(CreateArtToArtTagDto) {}
