import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as Joi from 'joi';

const configFileNameObj = {
  development: 'dev',
  test: 'test',
  production: 'prod',
};

const env = process.env.NODE_ENV;

console.log(env);
const schema = Joi.object().keys({
  app: Joi.object({
    port: Joi.number().default(8009).required(),
    prefix: Joi.string().required(),
  }),
  mysql_config: Joi.object({
    synchronize: Joi.boolean().required(),
    database: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().required(),
  }),
  log_config: Joi.object({
    TIMESTAMP: Joi.boolean().required(),
    LOG_LEVEL: Joi.string().required(),
    LOG_ON: Joi.boolean().required(),
  }),
  email_config: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    secure: Joi.boolean().required(),
  }),
  redis_config: Joi.object({
    host: Joi.string().required(),
    port: Joi.string().required(),
    db: Joi.number().required(),
  }),
});

export default () => {
  const yamlConfig = join(__dirname, `../yml/${configFileNameObj[env]}.yml`);
  const config = yaml.load(readFileSync(yamlConfig, 'utf8')) as Record<
    string,
    any
  >;

  try {
    const { value, error } = schema.validate(config);
    if (error) {
      console.log(error);
    }
    return value;
  } catch (error) {
    console.log(error);
    return {};
  }
};
