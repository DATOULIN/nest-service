import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailModule } from '../../common/modules/email/email.module';
import { RedisModule } from '../../common/modules/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
