import { Module } from '@nestjs/common';
import { UserRepository } from '../shared/repositories/user.repository';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudStorageService } from 'src/shared/services/upload-file';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserRepository, PrismaService, UserService, CloudStorageService],
})
export class UserModule {}
