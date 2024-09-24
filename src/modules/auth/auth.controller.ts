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
import {
  CreateCommandAuthGoogleDto,
  OutputAuthGoogleDto,
} from './dtos/auth-google';
import { AuthGoogle } from './usecases/auth-google.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly auth: Auth,
    private readonly authGoogle: AuthGoogle,
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

  @Post('google')
  async authenticationGoogle(
    @Body() data: CreateCommandAuthGoogleDto,
  ): Promise<OutputAuthGoogleDto> {
    const response = await this.authGoogle.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Authentication with google failed for user: ${data.email}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(
      `User authenticated with google successfully: ${data.email}`,
    );
    return response.value;
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async test(): Promise<string> {
    return 'ok';
  }
}
