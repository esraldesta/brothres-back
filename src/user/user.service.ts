import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../shared/repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { transformToDto } from 'src/utils';
import { ProfileDto } from './dto/profile-dto';
import { File, Founders, Refered } from 'src/types';
import { CloudStorageService } from 'src/shared/services/upload-file';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly userService: UserRepository,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    if (dto.email) {
      const accountWithSameEmail = await this.userService.findByEmail(
        dto.email,
      );
      if (accountWithSameEmail && accountWithSameEmail.id !== id)
        throw new ConflictException(
          'An account is existed with same email adderess.',
        );
    }

    return await this.userService.updateUser(id, dto);
  }

  async updateUserBio(id: number, dto: { bio: string }): Promise<User> {
    return await this.userService.updateUser(id, dto);
  }

  async uploadAvatar(
    user: User,
    image: Express.Multer.File,
  ): Promise<{ image: string }> {
    const uploadResult = await this.cloudStorageService.uploadFile(
      image,
      'profile',
    );

    if (!uploadResult) {
      throw new BadRequestException('Failed to upload the profile image.');
    }

    if (user.image) {
      await this.cloudStorageService.removeFile(user.image, 'profile');
    }

    await this.userService.updateUser(user.id, {
      image: uploadResult.publicUrl,
    });

    return { image: uploadResult.publicUrl };
  }

  async getProfile(userId: number): Promise<ProfileDto> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('No user found with this id!');
    return transformToDto(ProfileDto, user);
  }

  async getFounders(
    page: number,
    pageSize: number,
  ): Promise<{ founders: Array<Founders>; count: number }> {
    const founders = await this.userService.getFounders(page, pageSize);
    const count = await this.userService.getUsersCount();
    return {
      founders,
      count,
    };
  }

  async getRefered(
    page: number,
    pageSize: number,
    myReferalId: string,
  ): Promise<{ refered: Array<Refered>; count: number }> {
    const [refered, count] = await Promise.all([
      this.userService.getRefered(page, pageSize, myReferalId),
      await this.userService.getReferedCount(myReferalId),
    ]);

    return { refered, count };
  }
}
