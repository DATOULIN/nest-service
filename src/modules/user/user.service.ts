import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '../../common/excetions/business.exception';
import { EmailService } from '../../common/modules/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email } = registerUserDto;
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
      // await this.emailService.sendWelcomeEmail({ to: res.email });
      return 'success';
    }
    throw new BusinessException('注册失败');
  }

  public encodePwd(pwd: string) {
    return pwd;
  }
}
