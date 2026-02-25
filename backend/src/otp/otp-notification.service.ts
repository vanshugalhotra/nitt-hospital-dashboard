import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { EmailService } from 'src/email/email.service';
import { LoggerService } from 'src/logger/logger.service';
import { ConfigService } from 'src/config/config.service';

import {
  OTP_EMAIL_TEMPLATE,
  OTP_TEXT_TEMPLATE,
} from 'src/email/templates/otp.template';

@Injectable()
export class OtpNotificationService {
  private readonly entity = 'OtpNotification';

  constructor(
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  /* -------------------------------------------------------------------------- */
  /* GENERATE OTP + SEND EMAIL */
  /* -------------------------------------------------------------------------- */

  async sendOtpEmail(email: string, action: string): Promise<void> {
    try {
      this.logger.info('Generating OTP for email', { email, action });

      const otp = await this.otpService.generateOtp(email);

      const appName = 'NITT Hospital';

      const html = this.emailService.renderTemplate(OTP_EMAIL_TEMPLATE, {
        appName,
        action,
        otp,
        year: new Date().getFullYear(),
      });

      const text = this.emailService.renderTemplate(OTP_TEXT_TEMPLATE, {
        appName,
        action,
        otp,
        expiryMinutes: this.configService.get('OTP_EXPIRY_MINUTES'),
        year: new Date().getFullYear(),
      });

      await this.emailService.sendEmail({
        to: email,
        subject: `${appName} - Verification Code`,
        html,
        text,
      });

      this.logger.info('OTP email sent successfully', { email });
    } catch (error: unknown) {
      this.logger.error('Failed to send OTP email', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new InternalServerErrorException('Failed to send OTP');
    }
  }

  /* -------------------------------------------------------------------------- */
  /* VERIFY OTP */
  /* -------------------------------------------------------------------------- */

  async verifyOtp(email: string, otp: string): Promise<void> {
    await this.otpService.verifyOtp(email, otp);
  }
}
