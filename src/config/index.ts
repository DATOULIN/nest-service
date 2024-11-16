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
});

export default () => {
  console.log(process.cwd());
  const yamlConfig = join(__dirname, `/${configFileNameObj[env]}.yml`);
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
