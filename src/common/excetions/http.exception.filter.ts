import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BusinessException } from './business.exception';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // todo 处理业务异常
    // 处理业务异常
    if (exception instanceof BusinessException) {
      const error = exception.getResponse();
      response.status(HttpStatus.OK).send({
        response: null,
        responseTime: new Date(),
        status: error['code'],
        message: error['message'],
        success: false,
      });
      return;
    }

    const exResponse = exception.getResponse();
    console.log(exResponse);
    if (typeof exResponse === 'string') {
      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.getResponse(),
      });
    } else {
      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(exception.getResponse() as any),
      });
    }
  }
}
