import { ConfigService } from '@config/service/config.service';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { Controller, Get, Inject, LoggerService } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/')
  async test() {
    const users = await this.prismaService.user.findMany();
    const mailConfig = this.configService.get('mail');
    this.loggerService.log(mailConfig.host);
    return users;
  }
}
