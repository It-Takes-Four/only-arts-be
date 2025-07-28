/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

type AllowedMimeType = typeof allowedMimeTypes[number];

export const createMulterOptions = (destination: 'arts' | 'collections' | 'profiles') => ({
  storage: diskStorage({
    destination: `./storage/uploads/${destination}/`,
    filename: (_req: any, file: any, cb: any) => {
      const uniqueSuffix = uuidv4();
      const fileExtension = extname(file.originalname);
      cb(null, `${uniqueSuffix}${fileExtension}`);
    },
  }),
  fileFilter: (_req: any, file: any, cb: any) => {
    if (allowedMimeTypes.includes(file.mimetype as AllowedMimeType)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const STORAGE_LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes,
} as const;
