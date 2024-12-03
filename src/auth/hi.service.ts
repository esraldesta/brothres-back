import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { UserRepository } from '../shared/repositories/user.repository';
import { StatusOk } from './types/status-ok';

@Injectable()
export class HiService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

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

  async signOut(userId: number): Promise<StatusOk> {
    await this.userRepository.updateRefreshToken(userId, null);
    return { status: 'ok', message: 'Token is invalidated' };
  }

  async refreshToken(userId: number): Promise<{ accessToken: string }> {
    const { accessToken } = await this.generateTokens(userId);
    return {
      accessToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
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
