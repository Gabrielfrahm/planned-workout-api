import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { LoggingModule } from '@modules/logger/logger.module';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { ConfigService } from '@config/service/config.service';

@Module({
  imports: [LoggingModule],
  controllers: [UserController],
  providers: [PrismaService, ConfigService],
})
export class UserModule {}
