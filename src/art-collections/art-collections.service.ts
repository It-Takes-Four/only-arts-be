import { Injectable } from '@nestjs/common';
import { CreateArtCollectionDto } from './dto/create-art-collection.dto';
import { UpdateArtCollectionDto } from './dto/update-art-collection.dto';

@Injectable()
export class ArtCollectionsService {
  create(createArtCollectionDto: CreateArtCollectionDto) {
    return 'This action adds a new artCollection';
  }

  findAll() {
    return `This action returns all artCollections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artCollection`;
  }

  update(id: number, updateArtCollectionDto: UpdateArtCollectionDto) {
    return `This action updates a #${id} artCollection`;
  }

  remove(id: number) {
    return `This action removes a #${id} artCollection`;
  }
}
