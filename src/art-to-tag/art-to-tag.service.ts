import { Injectable } from '@nestjs/common';
import { CreateArtToArtTagDto } from './dto/create-art-to-tag.dto';
import { UpdateArtToTagDto } from './dto/update-art-to-tag.dto';

@Injectable()
export class ArtToTagService {
  create(createArtToTagDto: CreateArtToArtTagDto) {
    return 'This action adds a new artToTag';
  }

  findAll() {
    return `This action returns all artToTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artToTag`;
  }

  update(id: number, updateArtToTagDto: UpdateArtToTagDto) {
    return `This action updates a #${id} artToTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} artToTag`;
  }
}
