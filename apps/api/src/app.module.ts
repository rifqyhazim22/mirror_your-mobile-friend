import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './modules/profiles/profiles.module';

@Module({
  imports: [ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
