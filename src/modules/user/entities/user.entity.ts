import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Checkin } from '../../checkIn/entities/checkIn.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
    nullable: true,
  })
  username: string;

  @Column({
    length: 255,
    comment: '密码',
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称',
    nullable: true,
  })
  nickName: string;

  @Column({
    comment: '邮箱',
    length: 50,
  })
  email: string;

  @Column({
    comment: '头像',
    length: 100,
    nullable: true,
  })
  headPic: string;

  @Column({
    comment: '手机号',
    length: 20,
    nullable: true,
  })
  phoneNumber: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @OneToMany(() => Checkin, (checkin) => checkin.user) // 与 Checkin 实体建立一对多关系
  checkins: Checkin[];
}
