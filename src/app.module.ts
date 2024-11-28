import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import configuration from './config';
import { APP_FILTER, APP_PIPE, APP_GUARD } from '@nestjs/core';
import { CustomerValidationPipe } from './common/pipe/customer.validation.pipe';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { buildConnectionOptions } from './config/db.config';
import { UploadModule } from './common/modules/upload/upload.module';
import { AuthModule } from './common/modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerModule } from './common/modules/logger/logger.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: buildConnectionOptions,
      inject: [ConfigService],
    }),
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule,
    AuthModule,
    UploadModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    // 统一响应格式
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 拦截http异常
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 验证管道
    {
      provide: APP_PIPE,
      useClass: CustomerValidationPipe,
    },
    // 鉴权
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
