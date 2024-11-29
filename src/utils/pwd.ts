import * as bcrypt from 'bcryptjs';

// 密码加密
export async function encodePwd(pwd: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pwd, salt);
}

/**
 * 对比密码
 * @password 数据库存的密码
 * @userPassword 用户输入的密码
 * */
export function compare(password: string, userPassword: string): boolean {
  return bcrypt.compareSync(password, userPassword);
}
