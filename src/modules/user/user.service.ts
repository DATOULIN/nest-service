import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '../../common/excetions/business.exception';
import { EmailService } from '../../common/modules/email/email.service';
import { RedisService } from '../../common/modules/redis/redis.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private emailService: EmailService,
    private redisService: RedisService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;
    await this.redisService.set(email, password);

    // 判断注册的邮箱是否存在
    const existUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existUser) {
      throw new BusinessException('该邮箱已被注册');
    }
    const tempUser = this.userRepository.create(registerUserDto);
    tempUser.password = this.encodePwd(tempUser.password);
    const res = await this.userRepository.save(tempUser);
    if (res) {
      await this.emailService.sendWelcomeEmail({ to: res.email });
      return 'success';
    }
    throw new BusinessException('注册失败');
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

  private encodePwd(pwd: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pwd, salt);
  }

  /**
   * @password 数据库存的密码
   * @userPassword 用户输入的密码
   * */
  private compare(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }
}
