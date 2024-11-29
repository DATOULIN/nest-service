import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { RedisService } from '../../../common/modules/redis/redis.service';
import { BusinessException } from '../../../common/filters/business.exception';
import { RedisCodeEnum } from '../../../enums/redisCodeEnum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    super();
  }

  // 生成token
  createToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('security_config').secret,
      expiresIn: this.configService.get('security_config').expiresIn,
    });
  }

  // 获取token
  getToken(request: any): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  // 验证jwt
  async validateToken(token: string): Promise<boolean | never> {
    try {
      return await this.parse(token);
    } catch (err) {
      return false;
    }
  }

  async validateRedisToken(
    token: string,
    payload: any,
  ): Promise<boolean | never> {
    const key = `${RedisCodeEnum.TOKEN}-${payload.userId}`;
    const redis_token = await this.redisService.get(key);

    if (!redis_token || redis_token !== token) {
      BusinessException.throwInvalid();
    }
    return true;
  }

  // 解析jwt
  public async parse(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('security_config').secret,
    });
  }

  // 解码JWT令牌
  async decode(token: string): Promise<any> {
    return this.jwtService.decode(token, null);
  }
}
