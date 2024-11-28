import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 允许跨域
  app.enableCors();

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');
  await app.listen(port);
}

bootstrap();
