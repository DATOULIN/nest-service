import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BusinessException } from './business.exception';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const massage = exception.message;
    const msg =
      exception.message || (status >= 500 ? 'Service Error' : 'Client Error');

    this.logger.error(msg, {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      massage,
    });

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
    if (typeof exResponse === 'string') {
      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.getResponse(),
      });
    } else {
      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        ...(exception.getResponse() as any),
      });
    }
  }
}
