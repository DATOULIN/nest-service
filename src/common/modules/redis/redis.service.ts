import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { buildRedisConfigOptions } from '../../../config/redis.config';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private configService: ConfigService) {
    const serverValue = buildRedisConfigOptions(configService);

    this.redisClient = new Redis({
      host: serverValue.redis.host,
      port: serverValue.redis.port,
      db: serverValue.redis.db,
    });
    console.log('Redis service started');
  }

  async set(key: string, value: string, expireTime = 60 * 60): Promise<void> {
    await this.redisClient.set(key, value);
    if (expireTime) {
      await this.redisClient.expire(key, expireTime);
    }
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async remove(key: string): Promise<any> {
    await this.redisClient.del(key);
  }
}
