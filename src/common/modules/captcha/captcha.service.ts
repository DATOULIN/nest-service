import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { BusinessException } from '../../filters/business.exception';

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
    const code = await this.redisService.get(`${key}-${email}`);
    if (code) {
      throw new BusinessException('验证码发生太频繁');
    }
    const randomCode = Math.random().toString().slice(2, 8);
    await this.redisService.set(`${key}-${email}`, randomCode, 60 * 5);
    await this.emailService.sedRegisterCaptcha({ to: email, code: randomCode });
  }
}
