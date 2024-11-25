import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SkipAuth } from '../../common/helper';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Post('login')
  login(@Body() createUserDto: RegisterUserDto) {
    return this.userService.register(createUserDto);
  }

  /**
   *修改个人信息
   */
  @Post('update')
  update(@Body() createUserDto: RegisterUserDto) {
    return this.userService.register(createUserDto);
  }

  /**
   *修改密码
   */
  @Post('update_pwd')
  updatePwd(@Body() createUserDto: RegisterUserDto) {
    return this.userService.register(createUserDto);
  }
}
