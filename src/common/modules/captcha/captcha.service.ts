import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class CaptchaService {
  constructor(
    private redisService: RedisService,
    private emailService: EmailService,
  ) {}

  /**
   * @key 存的key
   * @address 发送邮箱
   * */
  async sendCaptcha(key: string, email: string) {
    const captcha = await this.redisService.get(`${key}-${email}`);
    if (captcha) {
      return '发送太频繁！';
    }
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`${key}-${email}`, code, 60);
    await this.emailService.sedRegisterCaptcha({ to: email, code });
  }
}
