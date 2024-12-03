import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login-user.dto';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { transformToDto } from 'src/utils';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { SigninOkDto } from 'src/user/dto/sign-in-ok.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<{ id: number }> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }
    const { password, ...rest } = createUserDto;

    const hashedPassword = await hash(password);

    const myReferalId = randomUUID();

    const { id } = await this.userRepository.create({
      password: hashedPassword,
      ...rest,
      myReferalId,
    });

    return { id };
  }

  async signIn(dto: LoginDto): Promise<SigninOkDto> {
    const { userName, password } = dto;
    const user = await this.userRepository.findByUserName(userName);
    if (!user) throw new UnauthorizedException('Invalid Credentials!');

    const isPasswordMatched = verify(user.password, password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid Credentials!');
    }
    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    const hashedRt = await hash(refreshToken);
    await this.userRepository.updateRefreshToken(user.id, hashedRt);
    const unfilteredReturn = { ...user, accessToken, refreshToken };

    return transformToDto(SigninOkDto, unfilteredReturn);
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getProfile<T>(userId: number, dto: new () => T): Promise<T> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException('No user found with this id!');
    return transformToDto(dto, user);
  }

  async signOut(userId: number): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async refreshToken(userId: number): Promise<{ accessToken: string }> {
    const { accessToken } = await this.generateTokens(userId);
    return {
      accessToken,
    };
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ id: number }> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new UnauthorizedException('Invalid Refresh Token!');
    let refreshTokenMatched = false;

    if (!user.refreshToken)
      throw new UnauthorizedException('Invalid Refresh Token!');

    try {
      refreshTokenMatched = await verify(user.refreshToken, refreshToken);
    } catch (_) {
      throw new UnauthorizedException('Invalid Refresh Token!');
    }

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');
    const currentUser = { id: user.id };
    return currentUser;
  }
}
