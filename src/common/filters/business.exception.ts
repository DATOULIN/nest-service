import { HttpException, HttpStatus } from '@nestjs/common';
import { BUSINESS_CODE } from '../../enums/businessCodeEnum';

type BusinessError = {
  code: number;
  message: string;
};

export class BusinessException extends HttpException {
  constructor(error: BusinessError | string) {
    if (typeof error === 'string') {
      error = {
        code: BUSINESS_CODE.COMMON,
        message: error,
      };
    }
    super(error, HttpStatus.OK);
  }

  static throwSuccess() {
    throw new BusinessException({
      code: BUSINESS_CODE.SUCCESS,
      message: 'success',
    });
  }

  static throwForbidden() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  static throwTokenNotEmpty() {
    throw new BusinessException({
      code: BUSINESS_CODE.TOKEN_EMPTY,
      message: 'token不能为空',
    });
  }

  static throwInvalid() {
    throw new BusinessException({
      code: BUSINESS_CODE.TOKEN_INVALID,
      message: 'token已失效',
    });
  }
}
