import { IsEmail, IsNotEmpty, Min, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码最少 6 位' })
  password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: number;
}
