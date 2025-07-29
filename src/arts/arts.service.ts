import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtDtoRequest } from './dto/request/create-art.dto';
import { CreateArtResponse } from './dto/response/create-art.dto';
import { UpdateArtDtoRequest } from './dto/request/update-art.dto';
import { ArtNftService } from 'src/art-nft/art-nft.service';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService, UploadedFile } from 'src/shared/services/file-upload.service';
import { FileType } from '@prisma/client';

@Injectable()
export class ArtsService {
  constructor(private readonly prisma: PrismaService, private readonly artNftService: ArtNftService, private readonly fileUploadService: FileUploadService) { }

  async findAll() {
    return this.prisma.art.findMany({
      include: {
        artist: true,
        comments: true,
        tags: { include: { tag: true } },
        collections: true,
      },
      orderBy: { datePosted: 'desc' },
    });
  }

  async findById(id: string) {
    const art = await this.prisma.art.findUnique({
      where: { id },
      include: {
        artist: true,
        comments: true,
        tags: { include: { tag: true } },
        collections: true,
      },
    });
    if (!art) throw new NotFoundException(`Art with ID ${id} not found`);
    return art;
  }

  async findByArtist(artistId: string) {
    return this.prisma.art.findMany({
      where: { artistId },
      include: {
        tags: { include: { tag: true } },
        comments: true,
        collections: true,
      },
      orderBy: { datePosted: 'desc' },
    });
  }

  async createWithTags(dto: CreateArtDtoRequest, file: Express.Multer.File) {
    const validFile = file as UploadedFile;
    const artId = uuidv4();
    const tagIds = dto.tagIds?.length ? dto.tagIds : [];

    const saveFileResult = await this.fileUploadService.saveFile(validFile, FileType.arts);
    const imageFileId = saveFileResult.fileId

    const createArtResult = await this.artNftService.createArt(dto.artistId, artId);
    const tokenId = BigInt(createArtResult.tokenId);

    await this.prisma.art.create({
      data: {
        id: artId,
        tokenId: tokenId,
        title: dto.title, 
        description: dto.description,
        imageFileId: imageFileId,
        artistId: dto.artistId,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        artist: true,
        tags: { include: { tag: true } },
      },
    });

    return new CreateArtResponse(dto.artistId, artId, tokenId.toString())
  }


  async updateWithTags(id: string, dto: UpdateArtDtoRequest) {
    const { tagIds, ...updateData } = dto;

    if (tagIds) {
      await this.prisma.artToArtTag.deleteMany({ where: { artId: id } });
    }

    return this.prisma.art.update({
      where: { id },
      data: {
        ...updateData,
        ...(tagIds
          ? {
            tags: {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            },
          }
          : {}),
      },
      include: {
        artist: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.art.delete({ where: { id } });
  }
}
