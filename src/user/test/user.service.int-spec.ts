import { PrismaService } from 'src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { describe } from 'node:test';
import { AuthService } from 'src/auth/auth.service';
import { AppModule } from 'src/app.module';
import { user } from 'src/_mocks_';
import { UserService } from '../user.service';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('AuthService Int', () => {
  //   let prisma: PrismaService;
  let authService: AuthService;
  let prisma: PrismaService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // providers: [BlogsService, CloudStorageService, PrismaService],
      imports: [AppModule],
    }).compile();

    // prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);
    authService = moduleRef.get(AuthService);
    prisma = moduleRef.get(PrismaService);
    await prisma.cleanDatabase();
  });

  let userId: number;
  it('should create user', async () => {
    const result = await authService.register(user);
    userId = result.id;
  });

  it('should update user', async () => {
    const dto = {
      firstName: 'another name',
    } as UpdateUserDto;

    const result = await userService.updateUser(userId, dto);
    expect(result.firstName).toBe(dto.firstName);
  });
});
