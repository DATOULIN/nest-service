import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorator';
import { LocalStrategy } from '../modules/auth/strategies/loacl.strategy';
import { JwtStrategy } from '../modules/auth/strategies/jwt.strategy';
import { BusinessException } from '../excetions/business.exception';

interface JwtUserData {
  userId: number;
  username: string;
  email: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtStrategy: JwtStrategy,
    private localStrategy: LocalStrategy,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isSkinAuth = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果是白名单，则通行
    if (isSkinAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.jwtStrategy.getToken(request);

    // 如果不存在 token 则禁止放行
    if (!token) {
      BusinessException.throwTokenNotEmpty();
    }

    // 验证token的内容
    const validate = await this.jwtStrategy.validateToken(token);
    if (validate) {
      // 解析token
      const payload = await this.jwtStrategy.parse(token);
      // 验证redis中的token
      await this.jwtStrategy.validateRedisToken(token, payload);

      // // 解析用户信息
      // await this.localStrategy.validateUser(payload);

      request['user'] = payload;
      return true;
    }

    return false;
  }
}
