import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as fs from 'node:fs';
import { OrmLogInterceptor } from '../common/interceptors/orm.log.interceptor';
import { LoggerService } from '@nestjs/common';

// 收集modules下面所有模块的实体
const collectEntities = async (modulesPath: string) => {
  const entities: string[] = [];

  try {
    const modules = await fs.promises.readdir(modulesPath);

    for (const moduleName of modules) {
      const modulePath = join(modulesPath, moduleName);
      const entitiesPath = join(modulePath, 'entities');

      if (
        fs.existsSync(entitiesPath) &&
        fs.statSync(entitiesPath).isDirectory()
      ) {
        const entityFiles = await fs.promises.readdir(entitiesPath);
        for (const entityFile of entityFiles) {
          entities.push(join(entitiesPath, entityFile));
        }
      }
    }
  } catch (error) {
    console.error('Error collecting entities:', error);
    // 可以根据需要抛出错误或返回空数组
    return [];
  }

  return entities;
};

export async function buildConnectionOptions(
  configService: ConfigService,
  logger: LoggerService,
) {
  const config = configService.get('mysql_config');
  const logFlag = configService.get('log_config')['LOG_ON'] === true;

  const modulesPath = join(__dirname, '../modules'); // modules 目录的路径
  const entities = await collectEntities(modulesPath);

  return {
    ...config,
    entities: entities,
    logging: logFlag,
    logger: new OrmLogInterceptor(logger),
    connectorPackage: 'mysql2',
    extra: {
      authPlugin: 'sha256_password',
    },
  } as TypeOrmModuleOptions;
}
