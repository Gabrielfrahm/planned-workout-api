import {
  Body,
  Controller,
  Inject,
  LoggerService,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { CreateExerciseUseCase } from '../usecases/exercies/create-exercise.usecase';
import { CreateExerciseDto, OutputExerciseDto } from '../dtos/exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,

    private readonly createExercisesUseCase: CreateExerciseUseCase,
  ) {}

  @Post('/')
  @UseGuards(AuthenticationGuard)
  async createExercises(
    @Body() data: CreateExerciseDto,
  ): Promise<OutputExerciseDto> {
    const response = await this.createExercisesUseCase.execute({
      ...data,
    });

    if (response.isLeft()) {
      await this.loggerService.error(
        `Error when try create new Exercise with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `Exercise created ${JSON.stringify(response.value.name)}`,
    );

    return response.value;
  }
}
