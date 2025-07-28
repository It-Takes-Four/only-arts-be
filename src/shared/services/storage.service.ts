import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly uploadsPath = './storage/uploads';
  private readonly dummyAssetsPath = './storage/dummy-assets';

  constructor() {
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    const directories = [
      path.join(this.uploadsPath, 'arts'),
      path.join(this.uploadsPath, 'collections'),
      path.join(this.uploadsPath, 'profiles'),
      path.join(this.dummyAssetsPath, 'arts'),
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  generateFileName(originalName: string): string {
    const fileExtension = extname(originalName);
    const uniqueSuffix = uuidv4();
    return `${uniqueSuffix}${fileExtension}`;
  }

  getUploadPath(type: 'arts' | 'collections' | 'profiles'): string {
    return path.join(this.uploadsPath, type);
  }

  getDummyImageUrl(category: 'art' | 'collection' | 'profile', index?: number): string {
    const randomIndex = index || Math.floor(Math.random() * 20) + 1;
    
    switch (category) {
      case 'art':
        return `https://picsum.photos/800/800?random=${randomIndex}`;
      case 'collection':
        return `https://picsum.photos/1200/600?random=${randomIndex + 20}`;
      case 'profile':
        return `https://picsum.photos/200/200?random=${randomIndex + 100}`;
      default:
        return `https://picsum.photos/800/800?random=${randomIndex}`;
    }
  }

  isValidImageType(mimetype: string): boolean {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return allowedMimes.includes(mimetype);
  }

  getFileUrl(type: 'arts' | 'collections' | 'profiles', filename: string): string {
    return `/uploads/${type}/${filename}`;
  }
}

// Storage configuration constants
export const STORAGE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
  ] as readonly string[],
  uploadPaths: {
    arts: './storage/uploads/arts',
    collections: './storage/uploads/collections',
    profiles: './storage/uploads/profiles',
  },
} as const;
