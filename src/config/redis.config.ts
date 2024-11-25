import { ConfigService } from '@nestjs/config';

export function buildRedisConfigOptions(configService: ConfigService) {
  const config = configService.get('redis_config');

  const redisConfig = {
    host: config.host,
    port: config.port,
    db: config.db,
  };

  return {
    redis: redisConfig,
  };
}
