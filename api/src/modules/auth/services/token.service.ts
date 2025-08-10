import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EXP_TIME_IN_DAYS } from 'src/shared/config/constants';
import { RefreshTokensRepository } from 'src/shared/database/repositories/refreshTokens.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokensRepo: RefreshTokensRepository,
  ) {}

  async generateTokens(userId: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXP_TIME_IN_DAYS);

    const accessToken = await this.jwtService.signAsync({ sub: userId });

    const { id } = await this.refreshTokensRepo.create({
      data: { userId, expiresAt },
    });
    return {
      accessToken,
      refreshToken: id,
    };
  }

  async validateRefreshToken(refreshTokenId: string) {
    const currentRefreshToken = await this.refreshTokensRepo.findById({
      where: { id: refreshTokenId },
    });

    if (!currentRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (Date.now().toString() >= currentRefreshToken.expiresAt.toString()) {
      throw new UnauthorizedException('Expired refresh token');
    }

    return currentRefreshToken;
  }

  async revokeRefreshToken(refreshTokenId: string) {
    try {
      await this.refreshTokensRepo.delete({ where: { id: refreshTokenId } });
    } catch (error) {
      console.log(error);
    }
  }
}
