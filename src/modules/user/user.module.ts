import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailModule } from '../../common/modules/email/email.module';
import { RedisModule } from '../../common/modules/redis/redis.module';
import { AuthModule } from '../../common/modules/auth/auth.module';
import { CaptchaModule } from '../../common/modules/captcha/captcha.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    RedisModule,
    AuthModule,
    CaptchaModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
