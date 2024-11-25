import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { SkipAuth, UserInfo } from '../../common/helper';
import { JwtStrategy } from '../../common/modules/auth/strategies/jwt.strategy';
import { RedisService } from '../../common/modules/redis/redis.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtStrategy: JwtStrategy,
    private redisService: RedisService,
  ) {}

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
    const token = this.jwtStrategy.createToken({ userId: vo.id });
    await this.redisService.set(`token-${vo.id}`, token);

    return {
      data: vo,
      token,
    };
  }

  @Get('info')
  async info(@UserInfo('userId') userId: number) {
    return userId;
  }
}
