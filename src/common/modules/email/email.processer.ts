import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Mail } from './dto/send-email.dto';
import { EmailConfig } from 'src/config/email.config';

@Processor(EmailConfig.EmailQueueName)
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}
  @Process('welcome')
  async sendWelcomeEmail(job: Job<Mail>) {
    const { data } = job;
    await this.mailService.sendMail({
      ...data,
      subject: 'Welcome',
      template: 'welcome',
      context: {
        user: data.user,
      },
    });
  }

  @Process('sendRegisterCaptcha')
  async sendResetPasswordEmail(job: Job<Mail>) {
    const { data } = job;
    console.log(data);
    await this.mailService.sendMail({
      to: data.to,
      subject: 'Captcha',
      template: 'sendRegisterCaptcha',
      context: {
        code: data.code,
      },
    });
  }
}
