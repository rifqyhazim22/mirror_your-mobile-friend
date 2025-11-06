import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
