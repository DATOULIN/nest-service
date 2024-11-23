import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export function buildRedisConfigOptions(configService: ConfigService) {
  const config = configService.get('redis_config');

  return new Redis({
    host: config.host,
    port: config.port,
    db: config.db,
  });
}
