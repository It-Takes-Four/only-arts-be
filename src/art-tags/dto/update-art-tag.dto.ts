import { PartialType } from '@nestjs/swagger';
import { CreateArtTagDto } from './create-art-tag.dto';

export class UpdateArtTagDto extends PartialType(CreateArtTagDto) {}
