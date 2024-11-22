export interface Mail {
  from?: string; // 发送邮箱
  to: string; // 目标邮箱
  subject?: string;
  text?: string;
  [key: string]: any;
}
