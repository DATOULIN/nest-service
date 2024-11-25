import * as winston from 'winston';
import { utilities, WinstonModuleOptions } from 'nest-winston';
import { Console } from 'winston/lib/winston/transports';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
function createDailyRotateTrasnport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs', // 日志保存的目录
    filename: `${filename}-%DATE%.log`, // 日志名称，占位符 %DATE% 取值为 datePattern 值。
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
  });
}

export function buildLoggerConfigOption(configService: ConfigService) {
  const config = configService.get('log_config');
  const timestamp = config.TIMESTAMP;
  const conbine = [];
  if (timestamp) {
    conbine.push(winston.format.timestamp());
  }
  conbine.push(utilities.format.nestLike());
  const consoleTransports = new Console({
    level: config.LOG_LEVEL || 'info',
    format: winston.format.combine(...conbine),
  });

  return {
    level: config.LOG_LEVEL || 'info',
    transports: [
      consoleTransports,
      ...(config.LOG_ON
        ? [
            createDailyRotateTrasnport('info', 'application'),
            createDailyRotateTrasnport('warn', 'error'),
            createDailyRotateTrasnport('debug', 'debug'),
          ]
        : []),
    ],
  } as WinstonModuleOptions;
}
