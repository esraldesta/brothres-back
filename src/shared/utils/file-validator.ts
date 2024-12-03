import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export function FileUploadInterceptor(fieldName: string, maxSizeMB = 1) {
  return FileInterceptor(fieldName, {
    storage: memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024 }, // File size limit in MB
    fileFilter: (req, file, callback) => {
      if (file && !file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
        return callback(
          new BadRequestException('Only image files are allowed'),
          false,
        );
      }
      callback(null, true);
    },
  });
}
