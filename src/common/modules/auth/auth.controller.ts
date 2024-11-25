import { Controller, Get } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SkipAuth, UserInfo } from '../../helper';
import { RedisService } from '../redis/redis.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtStrategy: JwtStrategy,
    private redisService: RedisService,
  ) {}

  @SkipAuth()
  @Get('/getToken')
  async getToken(@UserInfo('userId') userId: number) {
    const token = this.jwtStrategy.createToken({ userId: userId });
    await this.redisService.set(`token-${userId}`, token);
    return token;
  }

  @SkipAuth()
  @Get('/removeToken')
  async removeToken(@UserInfo('userId') userId: number) {
    await this.redisService.remove(`token-${userId}`);
    return 'success';
  }
}
