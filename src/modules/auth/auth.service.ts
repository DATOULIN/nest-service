import { Injectable } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisService } from '../../common/modules/redis/redis.service';
import { RedisCodeEnum } from '../../enums/redisCodeEnum';

@Injectable()
export class AuthService {
  constructor(
    private jwtStrategy: JwtStrategy,
    private redisService: RedisService,
  ) {}

  async getToken(payload: Payload) {
    const token = this.jwtStrategy.createToken(payload);
    await this.redisService.set(
      `${RedisCodeEnum.TOKEN}-${payload.userId}`,
      token,
    );
    return token;
  }

  async removeToken(userId: number) {
    await this.redisService.remove(`${RedisCodeEnum.TOKEN}-${userId}`);
  }

  async decodeToken(token: string) {
    return await this.jwtStrategy.decode(token);
  }
}
