export enum RedisCodeEnum {
  // 存在redis的token关键字
  TOKEN = 'TOKEN',
  // 存在redis的注册验证码关键字
  REGISTER_CAPTCHA = 'REGISTER',
  // 存在redis的重置密码验证码关键字
  RESET_PWD_CAPTCHA = 'RESET_PWD',
  // 存在redis的修改密码验证码关键字
  CHANGE_PWD_CAPTCHA = 'CHANGE_PWD',
}
