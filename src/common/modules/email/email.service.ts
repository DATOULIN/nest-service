import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Mail } from './dto/send-email.dto';
import { BusinessException } from '../../filters/business.exception';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}

  async sendWelcomeEmail(sendEmailDto: Mail) {
    const job = await this.emailQueue.add('welcome', sendEmailDto);
    if (job.id) {
      return 'success';
    } else {
      throw new BusinessException('发送失败');
    }
  }

  async sedRegisterCaptcha(sendEmailDto: Mail) {
    const job = await this.emailQueue.add('sendRegisterCaptcha', sendEmailDto);
    if (job.id) {
      return 'success';
    } else {
      throw new BusinessException('发送失败');
    }
  }
}
