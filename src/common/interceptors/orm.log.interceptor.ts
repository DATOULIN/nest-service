import { Logger, QueryRunner } from 'typeorm';
import { LoggerService } from '@nestjs/common';

export class OrmLogInterceptor implements Logger {
  constructor(private readonly logger: LoggerService) {}

  log(level: 'log' | 'info' | 'warn', message: any) {
    this.logger.log(message);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.log({
      sql: query,
      parameters,
    });
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error({
      sql: query,
      parameters,
    });
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.log({
      sql: query,
      parameters,
      time,
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.log(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(message);
  }
}
