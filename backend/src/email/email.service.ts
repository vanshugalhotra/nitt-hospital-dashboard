import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get('SMTP_HOST');
    const port = Number(this.configService.get('SMTP_PORT') ?? 587);
    const user = this.configService.get('SMTP_USER');
    const pass = this.configService.get('SMTP_PASS');

    if (!host || !user || !pass) {
      throw new Error('SMTP configuration is missing');
    }

    this.isProduction = this.configService.get('NODE_ENV') === 'production';

    const transporterOptions: SMTPTransport.Options = {
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    };

    this.transporter =
      nodemailer.createTransport<SMTPTransport.SentMessageInfo>(
        transporterOptions,
      );
  }

  /* -------------------------------------------------------------------------- */
  /* PUBLIC SEND METHOD */
  /* -------------------------------------------------------------------------- */

  async sendEmail({
    to,
    subject,
    html,
    text,
  }: SendEmailOptions): Promise<void> {
    try {
      if (!this.isProduction) {
        this.logger.warn(
          `Email sending (non-production) → To: ${to} | Subject: ${subject}`,
        );
      }

      const info = await this.transporter.sendMail({
        from: this.getFromAddress(),
        to,
        subject,
        html,
        text,
      });

      this.logger.log(`Email sent → MessageId: ${info.messageId}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown email error';

      this.logger.error(`Email sending failed → ${message}`);

      throw new InternalServerErrorException('Failed to send email');
    }
  }

  /* -------------------------------------------------------------------------- */
  /* SIMPLE TEMPLATE HELPER */
  /* -------------------------------------------------------------------------- */

  renderTemplate(
    template: string,
    variables: Record<string, string | number>,
  ): string {
    let rendered = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    }

    return rendered;
  }

  /* -------------------------------------------------------------------------- */
  /* INTERNAL UTIL */
  /* -------------------------------------------------------------------------- */

  private getFromAddress(): string {
    return 'NITT Hospital <no-reply@nitt.edu>';
  }
}
