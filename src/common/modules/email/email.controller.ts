import { Controller, Post, Body } from '@nestjs/common';

import { EmailService } from './email.service';
import { Mail } from './dto/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: Mail) {
    await this.emailService.sendWelcomeEmail(sendEmailDto);
  }
}