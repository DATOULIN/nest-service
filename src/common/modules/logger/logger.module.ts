import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

import { LoggerService } from './logger.service';

import { buildLoggerConfigOption } from '../../../config/logger.config';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildLoggerConfigOption,
    }),
  ],
  providers: [LoggerService],
})
export class LoggerModule {}
