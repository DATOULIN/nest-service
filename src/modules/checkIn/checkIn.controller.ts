import { Controller, Get, Post } from '@nestjs/common';
import { CheckinService } from './checkIn.service';
import { UserInfo } from '../../common/decorator';

@Controller('checkin')
export class CheckInController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  async checkin(
    @UserInfo('userId') userId: number,
  ): Promise<{ message: string }> {
    const result = await this.checkinService.checkin(userId);
    return { message: result };
  }

  @Get('status')
  async getCheckinStatus(
    @UserInfo('userId') userId: number,
  ): Promise<{ checkedIn: boolean }> {
    const checkedIn = await this.checkinService.getCheckinStatus(userId);
    return { checkedIn };
  }
}
