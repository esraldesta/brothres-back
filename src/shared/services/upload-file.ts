import { Bucket, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from 'path';
import { File } from 'src/types';

@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      keyFilename: this.configService.get<string>('GCP_KEY_FILE_PATH'),
    });
    const bucketName = this.configService.get<string>('GCP_BUCKET_NAME');
    if (!bucketName) throw new Error('bucketName is not found');
    this.bucket = this.storage.bucket(bucketName);
  }

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination
      .replace(/^\.+/g, '')
      .replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  private setFilename(uploadedFile: File): string {
    const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}${fileName.ext}`
      .replace(/^\.+/g, '')
      .replace(/^\/+/g, '')
      .replace(/\r|\n/g, '_');
  }

  private getFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  async uploadFile(uploadedFile: File, destination: string): Promise<any> {
    const fileName =
      this.setDestination(destination) + this.setFilename(uploadedFile);
    const file = this.bucket.file(fileName);
    try {
      await file.save(uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
      });
    } catch (error: any) {
      //throw new BadRequestException(error?.message);
      return null;
    }
    return {
      ...file.metadata,
      publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
    };
  }

  async removeFile(fileName: string, destination = ''): Promise<void> {
    const name = this.getFileName(fileName);
    let fullName = name;
    if (destination) {
      fullName = destination + '/' + name;
    }
    const file = this.bucket.file(fullName);
    try {
      await file.delete();
    } catch (error: any) {
      console.error(error);
      // throw new BadRequestException(error?.message);
    }
  }
}
