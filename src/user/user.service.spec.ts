import { UserRepository } from 'src/shared/repositories/user.repository';
import { UserService } from './user.service';
import { CloudStorageService } from 'src/shared/services/upload-file';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCloudStorageService,
  mockFile,
  mockUserRepository,
} from 'src/_mocks_';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let cloudStorageService: jest.Mocked<CloudStorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: CloudStorageService, useValue: mockCloudStorageService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    cloudStorageService = module.get(CloudStorageService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('update user', () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'john',
      email: 'john@gmail.com',
      bio: 'nice',
      image: 'https://image.img',
    };
    it('should throw ConflictException', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: 2 });

      try {
        await userService.updateUser(1, updateUserDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual(
          'An account is existed with same email adderess.',
        );
      }
    });
    it('should update user', async () => {
      mockUserRepository.findByEmail.mockResolvedValueOnce({ id: 1 });
      mockUserRepository.updateUser.mockResolvedValueOnce(updateUserDto);

      const result = await userService.updateUser(1, updateUserDto);

      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
        1,
        updateUserDto,
      );
      expect(result).toBe(updateUserDto);
    });
  });
  describe('upload avatar', () => {
    it('should upload a new avatar and remove the old one if it exists', async () => {
      const mockUser = { id: 1, image: 'old-avatar-url.png' } as any;

      const newImageUrl = 'http://cloud-storage.com/new-avatar.png';

      cloudStorageService.uploadFile.mockResolvedValue(newImageUrl);
      cloudStorageService.removeFile.mockResolvedValue(undefined);
      mockUserRepository.updateUser.mockResolvedValue(undefined);

      const result = await userService.uploadAvatar(mockUser, mockFile);

      expect(cloudStorageService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'profile',
      );

      expect(cloudStorageService.removeFile).toHaveBeenCalledWith(
        'old-avatar-url.png',
        'profile',
      );

      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(1, {
        image: newImageUrl,
      });

      expect(result).toEqual({ image: newImageUrl });
    });

    it('should return BadRequestException', async () => {
      const mockUser = { id: 1, image: 'old-avatar-url.png' } as any;
      cloudStorageService.uploadFile.mockResolvedValue(null);
      try {
        await userService.uploadAvatar(mockUser, mockFile);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
