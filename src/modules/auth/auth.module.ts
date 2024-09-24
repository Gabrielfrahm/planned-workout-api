import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserTokenRepository } from './repository/userToken.repository';
import { JwtService } from './services/jwt.service';
import { UserModule } from '@modules/user/user.module';
import { LoggingModule } from '@modules/logger/logger.module';
import { AuthenticationGuard } from './middlewares/authenticate.guard';
import { Auth } from './usecases/auth.usecase';
import { AuthGoogle } from './usecases/auth-google.usecase';

@Module({
  imports: [UserModule, LoggingModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    {
      provide: 'userTokenRepository',
      useFactory: (prismaService: PrismaService): UserTokenRepository =>
        new UserTokenRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: 'jwtService',
      useFactory: (): JwtService => new JwtService(),
    },
    {
      provide: AuthenticationGuard,
      useFactory: (jwtService: JwtService): AuthenticationGuard =>
        new AuthenticationGuard(jwtService),
      inject: ['jwtService'],
    },
    Auth,
    AuthGoogle,
  ],
  exports: ['userTokenRepository', 'jwtService', AuthenticationGuard],
})
export class AuthModule {}
