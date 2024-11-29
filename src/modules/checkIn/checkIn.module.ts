import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkin } from './entities/checkIn.entity';
import { CheckInController } from './checkIn.controller';
import { CheckinService } from './checkIn.service';

@Module({
  imports: [TypeOrmModule.forFeature([Checkin])],
  providers: [CheckinService],
  controllers: [CheckInController],
  exports: [CheckinService],
})
export class CheckInModule {}
