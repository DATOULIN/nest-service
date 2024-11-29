import { IsEmail, IsEnum } from 'class-validator';
import { CaptchaBusinessTypeEnum } from '../../../../enums';

export class CaptchaDto {
  @IsEnum(CaptchaBusinessTypeEnum)
  businessType: CaptchaBusinessTypeEnum;
  @IsEmail()
  email: string;
}
