import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // إعداد السيرفر المسؤول عن الإرسال (جوجل SMTP)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'), // إيميلك اللي في الـ .env
        pass: this.configService.get<string>('EMAIL_PASS'), // الـ App Password الـ 16 حرف
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: to,
        subject: subject,
        text: body, // أو html: body لو بتبعتي قالب جاهز
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to}. MessageId: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error; // عشان لو حصل مشكلة السيرفر يصرخ ويقولنا العيب فين
    }
  }
}