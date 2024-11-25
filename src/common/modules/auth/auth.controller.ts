import { Controller, Get, Query } from '@nestjs/common';
import { SkipAuth, UserInfo } from '../../helper';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Get('/getToken')
  async getToken(@Query() query: { userId: number }) {
    return await this.authService.getToken(query.userId);
  }

  @SkipAuth()
  @Get('/removeToken')
  async removeToken(@UserInfo('userId') userId: number) {
    await this.authService.removeToken(userId);
    return 'success';
  }
}
