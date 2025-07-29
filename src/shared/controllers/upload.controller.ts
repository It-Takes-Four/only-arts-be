import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Res,
  Param,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileUploadService } from '../services/file-upload.service';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }

  @Get(':type/:fileid')
  async serveFile(
    @Param('fileid') fileid: string,
    @Res() res: Response,
  ) {
    let fileBuffer: Buffer;
    let mimeType: string;
    try {
      const result = await this.fileUploadService.retrieveFileById(fileid);
      fileBuffer = result.fileBuffer;
      mimeType = result.mimeType;
    } catch (err) {
      throw new NotFoundException('File not found');
    }

    // Set proper headers
    res.set({
      'Content-Type': mimeType,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    });

    // Send the buffer
    res.send(fileBuffer);
  }

  @Get(':type/:fileid/blurred')
  async serveBlurredFile(
    @Param('fileid') fileid: string,
    @Res() res: Response,
  ) {
    let fileBuffer: Buffer;
    try {
      fileBuffer = await this.fileUploadService.retrieveFileBlurredById(fileid);
    } catch (err) {
      throw new NotFoundException('File not found');
    }

    res.set({
      'Content-Type': 'image/jpeg', // Always return as JPEG for blurred versions for lower storage and image quality
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    });

    res.send(fileBuffer);
  }

  @Post('art')
  @ApiOperation({ summary: 'Upload artwork image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Artwork image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadArtImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = this.fileUploadService.saveFile(file as any, 'arts');
      return {
        message: 'Art image uploaded successfully',
        ...result,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      throw new BadRequestException(message);
    }
  }

  @Post('collection')
  @ApiOperation({ summary: 'Upload collection cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Collection cover image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadCollectionCover(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = this.fileUploadService.saveFile(file, 'collections');
      return {
        message: 'Collection cover uploaded successfully',
        ...result,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      throw new BadRequestException(message);
    }
  }

  @Post('profile')
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile picture file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = this.fileUploadService.saveFile(file, 'profiles');
      return {
        message: 'Profile picture uploaded successfully',
        ...result,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      throw new BadRequestException(message);
    }
  }
}
