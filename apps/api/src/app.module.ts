import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { StructuredLoggerInterceptor } from './common/logger/structured-logger.interceptor';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { SentryInterceptor } from './common/sentry/sentry.interceptor';

@Module({
  imports: [PrismaModule, AuthModule, ProfilesModule, PaymentsModule, HealthModule, MetricsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StructuredLoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {}
