import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export enum EmailConfig {
  EmailQueueName = 'emailSending',
}

export function buildEmailConfigOptions(configService: ConfigService) {
  const config = configService.get('email_config');
  const emailConfig = {
    transport: {
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    },
    defaults: {
      from: config.user, //发送人 你的邮箱地址
    },
    template: {
      dir: join(__dirname, '../../', 'templates'),
      adapter: new HandlebarsAdapter(),
    },
  };
  return {
    ...emailConfig,
  };
}
