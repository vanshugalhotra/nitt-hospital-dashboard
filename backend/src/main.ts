import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggerService } from './logger/logger.service';
import helmet from 'helmet';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  app.enableShutdownHooks();

  const port = configService.get('PORT');
  const nodeEnv = configService.get('NODE_ENV');

  // Body limit
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(helmet());
  app.use(cookieParser());

  // ----------------------
  // CORS
  // ----------------------
  const allowedOrigins =
    configService
      .get('ALLOWED_ORIGINS')
      ?.split(',')
      .map((o) => o.trim()) || [];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Logic: Allow if no origin (local/server) or if it's in our white-list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Logging the origin as a string safely
        console.warn(
          `CORS blocked for origin: ${String(origin)}. Update ALLOWED_ORIGINS in .env`,
        );
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalInterceptors(new ResponseInterceptor());

  /**
   * ---------------------------
   * Swagger Setup
   * ---------------------------
   */
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NITT Hospital Dashboard API')
      .setDescription('API documentation for NITT Hospital Dashboard')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT access token',
          in: 'header',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.info(`Swagger running on http://localhost:${port}/api/docs`);
  }

  await app.listen(port);

  logger.info(`Server running on http://localhost:${port} [${nodeEnv}]`);
}

void bootstrap();
