import { Body, Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { CreateUserDto, OutputUserDto } from './dtos/user.dto';
import { CreateUserUseCase } from './usecases/create-user.usecase';

@Controller('users')
export class UserController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,

    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('/')
  async createUser(@Body() data: CreateUserDto): Promise<OutputUserDto> {
    const response = await this.createUserUseCase.execute(data);
    if (response.isLeft()) {
      await this.loggerService.error(
        `Error when try create new user with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `User created ${JSON.stringify(response.value.email)}`,
    );

    return response.value;
  }
}
