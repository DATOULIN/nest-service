import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkin } from './entities/checkIn.entity';

function getYesterday() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
}

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Checkin)
    private checkinRepository: Repository<Checkin>,
  ) {}

  async checkin(userId: string): Promise<string> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = getYesterday(); // 计算昨天日期
    const existingCheckin = await this.checkinRepository.findOne({
      where: { user: { id: userId }, date: today },
    });

    if (existingCheckin) {
      return '今日已签到';
    }

    const lastCheckin = await this.checkinRepository.findOne({
      where: { user: { id: userId }, date: yesterday },
      order: { date: 'DESC' }, // 获取昨天的签到记录
    });

    let consecutiveDays = 1;
    if (lastCheckin) {
      consecutiveDays = lastCheckin.consecutiveDays + 1;
    }

    const newCheckin = this.checkinRepository.create({
      user: { id: userId },
      date: today,
      consecutiveDays, // 保存连续签到天数
    });
    await this.checkinRepository.save(newCheckin);

    // 根据连续签到天数发放奖励 (示例)
    if (consecutiveDays === 7) {
      // 发放奖励
      return '签到成功，获得7天连续签到奖励！';
    } else if (consecutiveDays === 30) {
      // 发放奖励
      return '签到成功，获得30天连续签到奖励！';
    }

    return '签到成功';
  }

  async getCheckinStatus(userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckin = await this.checkinRepository.findOne({
      where: { user: { id: userId }, date: today },
    });

    return !!existingCheckin; // 将结果转换为布尔值
  }
}
