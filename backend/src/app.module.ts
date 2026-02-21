import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ConfigModule, PrismaModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
