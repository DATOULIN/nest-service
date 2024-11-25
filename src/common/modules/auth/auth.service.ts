import { Injectable } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisService } from '../redis/redis.service';
import { KeyEnum } from '../../../enums';

@Injectable()
export class AuthService {
  constructor(
    private jwtStrategy: JwtStrategy,
    private redisService: RedisService,
  ) {}

  async getToken(userId: number) {
    const token = this.jwtStrategy.createToken({ userId: userId });
    await this.redisService.set(`${KeyEnum.TOKEN}-${userId}`, token);
    return token;
  }

  async removeToken(userId: number) {
    await this.redisService.remove(`${KeyEnum.TOKEN}-${userId}`);
  }
}
