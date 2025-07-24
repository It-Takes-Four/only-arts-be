import { Injectable } from '@nestjs/common';
import { CreateArtTagDto } from './dto/create-art-tag.dto';
import { UpdateArtTagDto } from './dto/update-art-tag.dto';

@Injectable()
export class ArtTagsService {
  create(createArtTagDto: CreateArtTagDto) {
    return 'This action adds a new artTag';
  }

  findAll() {
    return `This action returns all artTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artTag`;
  }

  update(id: number, updateArtTagDto: UpdateArtTagDto) {
    return `This action updates a #${id} artTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} artTag`;
  }
}
