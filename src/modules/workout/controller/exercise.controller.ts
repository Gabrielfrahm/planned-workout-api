import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { CreateExerciseUseCase } from '../usecases/exercies/create-exercise.usecase';
import {
  CreateExerciseDto,
  DeleteExerciseByIdDto,
  FindExerciseByIdDto,
  OutputExerciseDto,
  OutputSearchExercisesDto,
  SearchExerciseDto,
} from '../dtos/exercise.dto';
import { FindExerciseByIdUseCase } from '../usecases/exercies/find-exercise-by-id.usecase';
import { SearchExerciseUseCase } from '../usecases/exercies/search-exercise.usecase';
import { DeleteByIdExerciseUseCase } from '../usecases/exercies/delete-exercise.usecase';

@Controller('exercises')
export class ExercisesController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,

    private readonly createExercisesUseCase: CreateExerciseUseCase,
    private readonly findExerciseByIdUseCase: FindExerciseByIdUseCase,
    private readonly searchExercisesUseCase: SearchExerciseUseCase,
    private readonly deleteByIdExerciseUseCase: DeleteByIdExerciseUseCase,
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

  @Get('/:id')
  @UseGuards(AuthenticationGuard)
  async getByIdExercises(
    @Param() data: FindExerciseByIdDto,
  ): Promise<OutputExerciseDto> {
    const response = await this.findExerciseByIdUseCase.execute({
      ...data,
    });

    if (response.isLeft()) {
      await this.loggerService.error(
        `Error when try get Exercise with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `Exercise getting ${JSON.stringify(response.value.name)}`,
    );

    return response.value;
  }

  @Get('search/:workoutId')
  @UseGuards(AuthenticationGuard)
  async searchExercises(
    @Query() data: Omit<SearchExerciseDto, 'workoutId'>,
    @Param('workoutId') workoutId: string,
  ): Promise<OutputSearchExercisesDto> {
    const response = await this.searchExercisesUseCase.execute({
      workoutId: workoutId,
      ...data,
    });

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to search exercises with params  ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to search exercises with params ${JSON.stringify(data)} `,
    );

    return response.value;
  }

  @Delete('/:id')
  @UseGuards(AuthenticationGuard)
  async deleteById(@Param() data: DeleteExerciseByIdDto): Promise<string> {
    const response = await this.deleteByIdExerciseUseCase.execute(data);

    if (response.isLeft()) {
      await this.loggerService.error(
        `Error when try delete by id exercise with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(`exercise deleted ${data.id}`);

    return 'deleted';
  }
}
