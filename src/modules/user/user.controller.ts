import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  Query,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { SkipAuth, UserInfo } from '../../common/decorator';
import { AuthService } from '../auth/auth.service';
import { RedisService } from '../../common/modules/redis/redis.service';
import { BusinessException } from '../../common/filters/business.exception';
import { RedisCodeEnum } from '../../enums/redisCodeEnum';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private redisService: RedisService,
  ) {}

  /**
   *注册
   */
  @SkipAuth()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const code = await this.redisService.get(
      `${RedisCodeEnum.REGISTER_CAPTCHA}-${registerUserDto.email}`,
    );
    if (!code) {
      throw new BusinessException('验证码已失效');
    }
    if (Number(code) !== registerUserDto.captcha) {
      throw new BusinessException('验证码不正确');
    }
    const res = await this.userService.register(registerUserDto);
    if (res === 'isExist') {
      throw new BusinessException('邮箱已存在');
    }
    if (res === 'error') {
      throw new BusinessException('注册失败');
    }
    // 注册完，移除验证码，防止重复使用
    await this.redisService.remove(
      `${RedisCodeEnum.REGISTER_CAPTCHA}-${registerUserDto.email}`,
    );
    return 'success';
  }

  /**
   *登录
   */
  @SkipAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const vo = await this.userService.login(loginDto);
    const token = await this.authService.getToken({
      userId: vo.id,
      email: vo.email,
    });
    return {
      data: vo,
      token,
    };
  }

  /**
   * 重置密码
   * */
  @SkipAuth()
  @Put('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const code = await this.redisService.get(
      `${RedisCodeEnum.RESET_PWD_CAPTCHA}-${resetPasswordDto.email}`,
    );
    if (!code) {
      throw new BusinessException('验证码已失效');
    }
    if (Number(code) !== resetPasswordDto.captcha) {
      throw new BusinessException('验证码不正确');
    }
    const res = await this.userService.resetPassword(resetPasswordDto);
    if (res === 'isNotExist') {
      throw new BusinessException('邮箱不存在');
    }
    if (res === 'error') {
      throw new BusinessException('重置密码失败');
    }
    await this.redisService.remove(
      `${RedisCodeEnum.RESET_PWD_CAPTCHA}-${resetPasswordDto.email}`,
    );
    return 'success';
  }

  /**
   * 获取用户信息
   * */
  @Get('info')
  async info(@UserInfo('userId') userId: number) {
    const res = await this.userService.getUserInfo(userId);
    if (res === 'error') {
      throw new BusinessException('获取用户失败');
    }
    return {
      userId: res.id,
      email: res.email,
    };
  }
}
