import { PartialType } from '@nestjs/swagger';
import { CreateArtCollectionDto } from './create-art-collection.dto';

export class UpdateArtCollectionDto extends PartialType(CreateArtCollectionDto) {}
