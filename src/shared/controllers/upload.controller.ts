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
  ApiParam,
  ApiResponse,
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

  @Get(':fileid')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ 
    name: 'fileid', 
    description: 'UUID of the file to retrieve',
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'File retrieved successfully',
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
      'image/png': { schema: { type: 'string', format: 'binary' } },
      'image/gif': { schema: { type: 'string', format: 'binary' } },
      'image/webp': { schema: { type: 'string', format: 'binary' } }
    }
  })
  @ApiResponse({ status: 404, description: 'File not found' })
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
    } catch {
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

  @Get(':fileid/blurred')
  @ApiOperation({ summary: 'Get blurred version of file by ID' })
  @ApiParam({ 
    name: 'fileid', 
    description: 'UUID of the file to retrieve blurred version',
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Blurred file retrieved successfully',
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } }
    }
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async serveBlurredFile(
    @Param('fileid') fileid: string,
    @Res() res: Response,
  ) {
    let fileBuffer: Buffer;
    try {
      fileBuffer = await this.fileUploadService.retrieveFileBlurredById(fileid);
    } catch {
      throw new NotFoundException('File not found');
    }

    res.set({
      'Content-Type': 'image/jpeg', // Always return as JPEG for blurred versions for lower storage and image quality
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    });

    res.send(fileBuffer);
  }

  @Get('art/:fileid')
  @ApiOperation({ summary: 'Get artwork image by file ID' })
  @ApiParam({ 
    name: 'fileid', 
    description: 'UUID of the artwork file to retrieve',
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Artwork image retrieved successfully',
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
      'image/png': { schema: { type: 'string', format: 'binary' } },
      'image/gif': { schema: { type: 'string', format: 'binary' } },
      'image/webp': { schema: { type: 'string', format: 'binary' } }
    }
  })
  @ApiResponse({ status: 404, description: 'Artwork file not found' })
  async serveArtFile(
    @Param('fileid') fileid: string,
    @Res() res: Response,
  ) {
    return this.serveFile(fileid, res);
  }

  @Get('collection/:fileid')
  @ApiOperation({ summary: 'Get collection cover image by file ID' })
  @ApiParam({ 
    name: 'fileid', 
    description: 'UUID of the collection cover file to retrieve',
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Collection cover image retrieved successfully',
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
      'image/png': { schema: { type: 'string', format: 'binary' } },
      'image/gif': { schema: { type: 'string', format: 'binary' } },
      'image/webp': { schema: { type: 'string', format: 'binary' } }
    }
  })
  @ApiResponse({ status: 404, description: 'Collection cover file not found' })
  async serveCollectionFile(
    @Param('fileid') fileid: string,
    @Res() res: Response,
  ) {
    return this.serveFile(fileid, res);
  }

  @Get('profile/:fileid')
  @ApiOperation({ summary: 'Get profile picture by file ID' })
  @ApiParam({ 
    name: 'fileid', 
    description: 'UUID of the profile picture file to retrieve',
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile picture retrieved successfully',
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
      'image/png': { schema: { type: 'string', format: 'binary' } },
      'image/gif': { schema: { type: 'string', format: 'binary' } },
      'image/webp': { schema: { type: 'string', format: 'binary' } }
    }
  })
  @ApiResponse({ status: 404, description: 'Profile picture file not found' })
  async serveProfileFile(
    @Param('fileid') fileid: string,
    @Res() res: Response,
  ) {
    return this.serveFile(fileid, res);
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
  async uploadArtImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.fileUploadService.saveFile(file, 'arts');
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
  async uploadCollectionCover(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.fileUploadService.saveFile(file, 'collections');
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
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.fileUploadService.saveFile(file, 'profiles');
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
