import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '../../common/filters/business.exception';
import { EmailService } from '../../common/modules/email/email.service';
import { RedisService } from '../../common/modules/redis/redis.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private emailService: EmailService,
    private redisService: RedisService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;
    await this.redisService.set(email, password);

    // 判断注册的邮箱是否存在
    const existUser = await this.findUserExist({ email });
    if (existUser) {
      return 'isExist';
    }
    const tempUser = this.userRepository.create(registerUserDto);
    tempUser.password = this.encodePwd(tempUser.password);
    try {
      await this.userRepository.save(tempUser);
      await this.emailService.sendWelcomeEmail({ to: tempUser.email });
      return 'success';
    } catch (e) {
      this.logger.error(e, { UserService });
      return 'error';
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new BusinessException('用户不存在');
    }
    console.log(
      'this.compare(user.password, loginDto.password)',
      user.password,
      loginDto.password,
      this.compare(user.password, loginDto.password),
    );
    if (!this.compare(loginDto.password, user.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    return {
      id: user.id,
      email: user.email,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, password } = resetPasswordDto;

    // 判断邮箱是否存在
    const existUser = await this.findUserExist({ email });
    if (!existUser) {
      return 'isNotExist';
    }
    const foundUser = await this.userRepository.findOneBy({
      email,
    });
    foundUser.password = this.encodePwd(password);
    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, { UserService });
      return 'error';
    }
  }

  async getUserInfo(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      return user;
    } catch (e) {
      this.logger.error(e, { UserService });
      return 'error';
    }
  }

  private async findUserExist(params: any) {
    const existUser = await this.userRepository.findOne({
      where: { ...params },
    });
    return !!existUser;
  }

  // 密码加密
  private encodePwd(pwd: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pwd, salt);
  }

  /**
   * 对比密码
   * @password 数据库存的密码
   * @userPassword 用户输入的密码
   * */
  private compare(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }
}
