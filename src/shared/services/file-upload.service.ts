import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class FileUploadService {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  validateFile(file: UploadedFile | undefined): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File too large. Maximum size is 10MB.');
    }
  }

  generateFileName(originalName: string): string {
    const fileExtension = extname(originalName);
    const uniqueSuffix = uuidv4();
    return `${uniqueSuffix}${fileExtension}`;
  }

  getFileUrl(type: 'arts' | 'collections' | 'profiles', filename: string): string {
    return `/uploads/${type}/${filename}`;
  }

  ensureUploadDirectories(): void {
    const directories = [
      './storage/uploads/arts',
      './storage/uploads/collections',
      './storage/uploads/profiles',
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  saveFile(file: UploadedFile | undefined, type: 'arts' | 'collections' | 'profiles'): {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
  } {
    this.validateFile(file);
    this.ensureUploadDirectories();

    // Type assertion since we've validated the file exists
    const validFile = file as UploadedFile;

    const filename = this.generateFileName(validFile.originalname);
    const uploadPath = path.join(`./storage/uploads/${type}`, filename);

    // Write file buffer to destination
    fs.writeFileSync(uploadPath, validFile.buffer);

    return {
      filename,
      originalName: validFile.originalname,
      size: validFile.size,
      mimetype: validFile.mimetype,
      url: this.getFileUrl(type, filename),
    };
  }

  retrieveFile(type: 'arts' | 'collections' | 'profiles', fileName: string) {
    const completeFileName = path.join(`./storage/uploads/${type}`, fileName)

    // Validate file exists in storage
    if (!fs.existsSync(completeFileName)) {
      throw new NotFoundException('File not found');
    }

    // Returns file buffer
    return fs.readFileSync(completeFileName);
  }

  async retrieveFileBlurredCached(type: 'arts' | 'collections' | 'profiles', fileName: string): Promise<Buffer> {
    const originalPath = path.join(`./storage/uploads/${type}`, fileName);
    const blurredPath = path.join(`./storage/uploads/${type}/blurred`, `blurred_${fileName}`);

    // Check if blurred version already exists
    if (fs.existsSync(blurredPath)) {
      return fs.readFileSync(blurredPath);
    }

    // Check if original file exists
    if (!fs.existsSync(originalPath)) {
      throw new NotFoundException('File not found');
    }

    try {
      // Create blurred version
      const blurredBuffer = await this.createBlurredVersion(originalPath);

      // Ensure blurred directory exists
      const blurredDir = path.dirname(blurredPath);
      if (!fs.existsSync(blurredDir)) {
        // Create blurred directory
        fs.mkdirSync(blurredDir, { recursive: true });
      }

      
      // Cache the blurred version
      fs.writeFileSync(blurredPath, blurredBuffer);

      return blurredBuffer;
    } catch (error) {
      console.error('Error creating blurred image:', error);
      throw new BadRequestException('Failed to process image');
    }
  }

  private async createBlurredVersion(filePath: string): Promise<Buffer> {
    return await sharp(filePath)
      .resize(25, 25, { fit: 'cover' })
      .blur(8)
      .resize(200, 200, { kernel: 'nearest' })
      .jpeg({ quality: 10 })
      .toBuffer();
  }
}
