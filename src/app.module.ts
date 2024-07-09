import { Module } from '@nestjs/common';

import { ConfigModule } from '@config/config.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { HealthCheckController } from './health-check.controller';
import { WorkoutModule } from '@modules/workout/workout.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    WorkoutModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
