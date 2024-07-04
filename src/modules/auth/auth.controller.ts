import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Auth } from './usecases/auth.usecase';
import { CreateCommandAuthDto, OutputAuthDto } from './dtos/auth.dto';

import { AuthenticationGuard } from './middlewares/authenticate.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly auth: Auth,
  ) {}

  @Post('')
  async authentication(
    @Body() data: CreateCommandAuthDto,
  ): Promise<OutputAuthDto> {
    const response = await this.auth.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Authentication failed for user: ${data.email}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`User authenticated successfully: ${data.email}`);
    return response.value;
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async test(): Promise<string> {
    return 'ok';
  }
}
