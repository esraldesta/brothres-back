import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import refreshConfig from './config/refresh.config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { LoginDto } from 'src/user/dto/login-user.dto';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findByUserName: jest.fn(),
    updateRefreshToken: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
    verify: jest.fn(),
    signAsync: jest.fn().mockResolvedValue('mockToken'),
  };

  beforeEach(async () => {
    const mockRefreshConfig: ConfigType<typeof refreshConfig> = {
      secret: 'test-secret',
      expiresIn: '7d',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository, // Mock UserRepository
          useValue: mockUserRepository,
        },
        {
          provide: JwtService, // Mock JwtService
          useValue: mockJwtService,
        },
        {
          provide: refreshConfig.KEY, // Mock refreshConfig dependency
          useValue: mockRefreshConfig,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      nickName: 'Johnny',
      userName: 'johnny123',
      languages: ['English'],
      dob: new Date('2000-01-01'),
      email: 'test@example.com',
      country: 'USA',
      password: 'StrongPassword123!',
      sex: 'male',
      vkId: 'id',
      telegramUserName: 'username',
      phoneNumber: '1234',
      weChatId: 'id',
      facebookId: '12',
      referalId: '123',
      instagramUserName: 'username',
      state: 'state',
      city: 'city',
    };

    it('should should register user', async () => {
      mockUserRepository.findByEmail.mockResolvedValueOnce(null);

      const mockHashedPassword = 'hashedPassword123';
      (hash as jest.Mock).mockResolvedValueOnce(mockHashedPassword);
      mockUserRepository.create.mockResolvedValueOnce({ id: 1 });

      const result = await service.register(createUserDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: mockHashedPassword,
      });

      expect(result).toStrictEqual({ id: 1 });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValueOnce({
        email: 'test@example.com',
      });

      try {
        await service.register(createUserDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('User already exists!');
      }
    });
  });

  describe('sig in', () => {
    const signinDto: LoginDto = {
      userName: 'username',
      password: '123',
    };

    const user = {
      id: 1,
      email: 'testuser@example.com',
      userName: 'username',
      firstName: 'John',
      lastName: 'Doe',
      referalId: 'ref12345',
      city: 'New York',
      country: 'USA',
      role: 'admin',
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };

    it('should throw authorization error', async () => {
      mockUserRepository.findByUserName.mockResolvedValueOnce({
        password: '1234',
      });

      try {
        await service.signIn(signinDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid Credentials!');
      }
    });
    it('should return user data', async () => {
      mockUserRepository.findByUserName.mockResolvedValueOnce({
        ...user,
        password: 'hashedPassword',
      });
      (verify as jest.Mock).mockResolvedValueOnce(true);
      (hash as jest.Mock).mockResolvedValueOnce('hashedRefreshToken');
      const generateTokensSpy = jest
        .spyOn(service as any, 'generateTokens')
        .mockResolvedValue({
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
        });

      const result = await service.signIn(signinDto);

      expect(mockUserRepository.findByUserName).toHaveBeenCalledWith(
        signinDto.userName,
      );
      expect(verify).toHaveBeenCalledWith('hashedPassword', signinDto.password);
      expect(generateTokensSpy).toHaveBeenCalledWith(user.id);
      expect(mockUserRepository.updateRefreshToken).toHaveBeenCalledWith(
        user.id,
        'hashedRefreshToken',
      );
      expect(result).toEqual(user);
    });
  });
  describe('refresh token', () => {
    const userId = 1;
    const refreshToken = 'refresh';
    it('shoud hrow UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({
        refreshToken: 'bad refresh token',
      });

      try {
        await service.validateRefreshToken(userId, refreshToken);
      } catch (error: any) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid Refresh Token!');
      }
    });
    it('should return currentUser', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({
        refreshToken: 'refresh',
        id: 1,
      });

      (verify as jest.Mock).mockReturnValueOnce(true);

      const result = await service.validateRefreshToken(userId, refreshToken);

      expect(result).toEqual({ id: userId });
    });
  });
});
