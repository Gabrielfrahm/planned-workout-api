import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { LoggingModule } from '@modules/logger/logger.module';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CreateUserUseCase } from './usecases/create-user.usecase';

@Module({
  imports: [LoggingModule],
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: 'userRepository',
      useFactory: (prismaService: PrismaService): UserRepository =>
        new UserRepository(prismaService),
      inject: [PrismaService],
    },
    CreateUserUseCase,
  ],
  exports: ['userRepository'],
})
export class UserModule {}
