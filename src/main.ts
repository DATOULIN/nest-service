import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 日志记录
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  //统一响应格式
  app.useGlobalInterceptors(new TransformInterceptor());

  // 入参验证
  app.useGlobalPipes(new ValidationPipe());

  // 允许跨域
  app.enableCors();

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');
  await app.listen(port);
}

bootstrap();
