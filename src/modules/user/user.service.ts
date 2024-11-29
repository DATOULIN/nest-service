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
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { compare, encodePwd } from '../../utils/pwd';

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

    if (!compare(loginDto.password, user.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    return {
      userId: user.id,
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
    foundUser.password = await encodePwd(password);
    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, { UserService });
      return 'error';
    }
  }

  async getUserInfo(userId: string) {
    try {
      return await this.userRepository.findOne({
        where: { id: userId },
      });
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
}
