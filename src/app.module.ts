import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import configuration from './config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core';
import { CustomerValidationPipe } from './common/pipe/customer.validation.pipe';
import { HttpExceptionFilter } from './common/excetions/http.exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { buildConnectionOptions } from './config/db.config';
import { UploadModule } from './common/modules/upload/upload.module';
import { Logger } from 'winston';
import { LoggerModule } from './common/modules/logger/logger.module';
import { RequestLogInterceptor } from './common/interceptors/request.log.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthModule } from './common/modules/auth/auth.module';
import { JwtAuthGuard } from './common/modules/auth/guards/jwt.guard';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: buildConnectionOptions,
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
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
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: CustomerValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
