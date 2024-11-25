import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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

    // todo 处理业务异常

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
