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
import { WinstonModule } from './common/modules/logger/logger.module';
import { format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

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
    WinstonModule.forRootAsync({
      useValue: () => {
        return {
          level: 'debug',
          transports: [
            new transports.Console({
              format: format.combine(
                format.colorize(),
                format.printf(({ context, level, message, time }) => {
                  const appStr = `[NEST]`;
                  const contextStr = `[${context}]`;

                  return `${appStr} ${time} ${level} ${contextStr} ${message} `;
                }),
              ),
            }),
            new DailyRotateFile({
              dirname: 'logs', // 日志保存的目录
              filename: `error-%DATE%.log`, // 日志名称，占位符 %DATE% 取值为 datePattern 值。
              datePattern: 'YYYY-MM-DD-HH', // 日志轮换的频率，此处表示每天。
              zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
              maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
              maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
              // 记录时添加时间戳信息
              format: winston.format.combine(
                winston.format.timestamp({
                  format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.simple(),
              ),
            }),
          ],
        };
      },
    }),
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
