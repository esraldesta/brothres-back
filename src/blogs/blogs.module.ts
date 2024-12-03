import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogRepository } from 'src/shared/repositories/blog.repository';
import { CloudStorageService } from 'src/shared/services/upload-file';
import { APP_GUARD } from '@nestjs/core';
import { BlogFoundGuard } from './guards/blog-found.guard';

@Module({
  controllers: [BlogsController],
  providers: [
    BlogsService,
    PrismaService,
    BlogRepository,
    CloudStorageService,
    {
      provide: APP_GUARD,
      useClass: BlogFoundGuard,
    },
  ],
})
export class BlogsModule {}
