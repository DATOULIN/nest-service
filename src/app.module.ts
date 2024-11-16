import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import configuration from './config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CustomerValidationPipe } from './common/pipe/customer.validation.pipe';
import { HttpExceptionFilter } from './common/excetions/http.exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildConnectionOptions } from './common/database/orm.config';
import { RoleModule } from './modules/role/role.module';
@Module({
  imports: [
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
    UserModule,
    RoleModule,
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
