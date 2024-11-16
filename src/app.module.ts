import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import configuration from './config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CustomerValidationPipe } from './common/pipe/customer.validation.pipe';
import { HttpExceptionFilter } from './common/excetions/http.exception.filter';
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
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
  ],
})
export class AppModule {}
