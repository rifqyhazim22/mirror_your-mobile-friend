import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({ type: VersioningType.URI });
  app.enableCors();
  const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3000);
  await app.listen(port);
}
bootstrap();
