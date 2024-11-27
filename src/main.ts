import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_LOGGER_TOKEN } from './common/modules/logger/logger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  // 允许跨域
  app.enableCors();

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');
  await app.listen(port);
}

bootstrap();
