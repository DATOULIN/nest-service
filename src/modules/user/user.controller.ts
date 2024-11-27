import { Controller, Post, Body, Get, Req, Res, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { SkipAuth, UserInfo } from '../../common/decorator';
import { AuthService } from '../../common/modules/auth/auth.service';
import { CaptchaService } from '../../common/modules/captcha/captcha.service';
import { BusinessException } from '../../common/filters/business.exception';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private captchaService: CaptchaService,
  ) {}

  @SkipAuth()
  @Get('register-captcha')
  async sendCaptcha(@Query('email') email: string) {
    await this.captchaService.sendCaptcha('register', email);
  }

  /**
   *注册
   */
  @SkipAuth()
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  /**
   *登录
   */
  @SkipAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const vo = await this.userService.login(loginDto);
    const token = await this.authService.getToken(vo.id);

    return {
      data: vo,
      token,
    };
  }

  /**
   * 获取用户信息
   * */
  @Get('info')
  async info(@UserInfo('userId') userId: number) {
    return userId;
  }
}
