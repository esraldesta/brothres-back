import { PrismaService } from 'src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { describe } from 'node:test';
import { AuthService } from 'src/auth/auth.service';
import { AppModule } from 'src/app.module';
import { user } from 'src/_mocks_';
import { LoginDto } from 'src/user/dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService Int', () => {
  //   let prisma: PrismaService;
  let authService: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // providers: [BlogsService, CloudStorageService, PrismaService],
      imports: [AppModule],
    }).compile();

    // prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);
    prisma = moduleRef.get(PrismaService);
    await prisma.cleanDatabase();
  });

  let userId: number;
  let refreshToken: string;
  it('should create user', async () => {
    const result = await authService.register(user);
    userId = result.id;
  });

  it('should sign in user', async () => {
    const dto: LoginDto = {
      userName: user.userName,
      password: user.password,
    };

    const result = await authService.signIn(dto);
    refreshToken = result.refreshToken;
    expect(result.userName).toBe(user.userName);
    expect(result).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });
  it('should rturn user id', async () => {
    const result = await authService.validateRefreshToken(userId, refreshToken);
    expect(result).toStrictEqual({ id: userId });
  });

  it('should throw UnauthorizedException', async () => {
    try {
      await authService.validateRefreshToken(userId, 'invalid-token');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
