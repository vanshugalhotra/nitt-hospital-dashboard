import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { addMinutes, isAfter } from 'date-fns';
import { randomInt, createHash, timingSafeEqual } from 'crypto';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /* -------------------------------------------------------------------------- */
  /* INTERNAL HELPERS */
  /* -------------------------------------------------------------------------- */

  private generateOtpCode(): string {
    return randomInt(100000, 999999).toString();
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  /* -------------------------------------------------------------------------- */
  /* PUBLIC OTP FLOW */
  /* -------------------------------------------------------------------------- */

  async generateOtp(email: string): Promise<string> {
    const otpCode = this.generateOtpCode();
    const hashedOtp = this.hashOtp(otpCode);

    const otpExpiryMinutes = this.configService.get('OTP_EXPIRY_MINUTES') || 5;

    const expiresAt = addMinutes(new Date(), otpExpiryMinutes);

    await this.prisma.$transaction([
      this.prisma.emailOTP.updateMany({
        where: { email, used: false },
        data: { used: true },
      }),
      this.prisma.emailOTP.create({
        data: {
          email,
          otpCode: hashedOtp,
          expiresAt,
        },
      }),
    ]);

    return otpCode;
  }

  async verifyOtp(email: string, otpCode: string): Promise<void> {
    const otpRecord = await this.prisma.emailOTP.findFirst({
      where: { email, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) throw new BadRequestException('Invalid OTP');

    if (isAfter(new Date(), otpRecord.expiresAt)) {
      throw new BadRequestException('OTP expired');
    }

    const otpMaxAttempts = this.configService.get('OTP_MAX_ATTEMPTS') || 5;

    if (otpRecord.attempts >= otpMaxAttempts) {
      throw new BadRequestException('Too many attempts');
    }

    const hashedInput = this.hashOtp(otpCode);

    const isValid = timingSafeEqual(
      Buffer.from(hashedInput),
      Buffer.from(otpRecord.otpCode),
    );

    if (!isValid) {
      await this.prisma.emailOTP.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.emailOTP.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });
  }

  /* -------------------------------------------------------------------------- */
  /* ADMIN / TESTING APIs */
  /* -------------------------------------------------------------------------- */

  async getAll() {
    return this.prisma.emailOTP.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markUsed(id: string) {
    const otp = await this.prisma.emailOTP.findUnique({
      where: { id },
    });

    if (!otp) {
      throw new NotFoundException('OTP not found');
    }

    return this.prisma.emailOTP.update({
      where: { id },
      data: { used: true },
    });
  }

  async deleteOne(id: string) {
    const otp = await this.prisma.emailOTP.findUnique({
      where: { id },
    });

    if (!otp) {
      throw new NotFoundException('OTP not found');
    }

    return this.prisma.emailOTP.delete({
      where: { id },
    });
  }

  async deleteExpired() {
    return this.prisma.emailOTP.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}
