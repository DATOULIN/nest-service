import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailProcessor } from './email.processer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { buildEmailConfigOptions, EmailConfig } from 'src/config/email.config';
import { buildRedisConfigOptions } from '../../../config/redis.config';
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: buildRedisConfigOptions,
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: EmailConfig.EmailQueueName,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: buildEmailConfigOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
