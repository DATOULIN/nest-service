import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CaptchaDto } from './dto/captcha.dto';
import { SkipAuth, UserInfo } from '../../decorator';
import { CaptchaBusinessTypeEnum } from '../../../enums';
import { CaptchaService } from './captcha.service';
import { RedisCodeEnum } from '../../../enums/redisCodeEnum';

@Controller()
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}

  /**
   * 获取验证码
   * */
  @SkipAuth()
  @Post('/sendCaptcha')
  async sendCaptcha(@Body() captchaDto: CaptchaDto) {
    switch (captchaDto.businessType) {
      case CaptchaBusinessTypeEnum.REGISTER:
        await this.captchaService.sendCaptcha(
          RedisCodeEnum.REGISTER_CAPTCHA,
          captchaDto.email,
        );
        break;
      case CaptchaBusinessTypeEnum.RESET_PWD:
        console.log('enter2');
        await this.captchaService.sendCaptcha(
          RedisCodeEnum.RESET_PWD_CAPTCHA,
          captchaDto.email,
        );
        break;
    }

    return 'success';
  }

  /**
   * 获取验证码---需要token
   * */
  @Post('/auth/sendCaptcha')
  async sendAuthCaptcha(
    @Body('businessType', ValidationPipe)
    businessType: CaptchaBusinessTypeEnum,
    @UserInfo() userInfo: any,
  ) {
    await this.captchaService.sendCaptcha(
      RedisCodeEnum.CHANGE_PWD_CAPTCHA,
      userInfo.email,
    );
    return 'success';
  }
}
