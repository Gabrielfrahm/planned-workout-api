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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkoutUseCase } from '../usecases/create-workout.usecase';
import {
  CreateWorkoutDto,
  DeleteWorkoutByIdDto,
  FindWorkoutByIdDTo,
  OutputSearchWorkoutsDto,
  OutputWorkoutDto,
  SearchWorkoutsDto,
} from '../dtos/workout.dto';
import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { FindByIdWorkoutUseCase } from '../usecases/find-by-id-workout.usecase';
import { DeleteByIdWorkoutUseCase } from '../usecases/delete-workout.usecase';
import { SearchWorkoutsUseCase } from '../usecases/search-workout.usecase';
import { Request } from 'express';

@Controller('workouts')
export class WorkoutsController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,

    private readonly createWorkoutUseCase: CreateWorkoutUseCase,
    private readonly findByIdWorkoutUseCase: FindByIdWorkoutUseCase,
    private readonly deleteByIdWorkoutUseCase: DeleteByIdWorkoutUseCase,
    private readonly searchWorkoutsUseCase: SearchWorkoutsUseCase,
  ) {}

  @Post('/')
  @UseGuards(AuthenticationGuard)
  async createWorkouts(
    @Body() data: Omit<CreateWorkoutDto, 'userId'>,
    @Req() req: Request,
  ): Promise<OutputWorkoutDto> {
    const response = await this.createWorkoutUseCase.execute({
      userId: req['user'].id,
      ...data,
    });

    if (response.isLeft()) {
      await this.loggerService.error(
        `Error when try create new workout with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `Workout created ${JSON.stringify(response.value.name)}`,
    );

    return response.value;
  }

  @Get('/:id')
  @UseGuards(AuthenticationGuard)
  async findById(@Param() data: FindWorkoutByIdDTo): Promise<OutputWorkoutDto> {
    const response = await this.findByIdWorkoutUseCase.execute(data);

    if (response.isLeft()) {
      await this.loggerService.error(
        `Error when try find by id workout with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `Workout found ${JSON.stringify(response.value.name)}`,
    );

    return response.value;
  }

  @Delete('/:id')
  @UseGuards(AuthenticationGuard)
  async deleteById(@Param() data: DeleteWorkoutByIdDto): Promise<string> {
    const response = await this.deleteByIdWorkoutUseCase.execute(data);

    if (response.isLeft()) {
      await this.loggerService.error(
        `Error when try delete by id workout with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(`Workout deleted ${data.id}`);

    return 'deleted';
  }

  @Get('search/workouts')
  @UseGuards(AuthenticationGuard)
  async searchWorkouts(
    @Query() data: Omit<SearchWorkoutsDto, 'userId'>,
    @Req() req: Request,
  ): Promise<OutputSearchWorkoutsDto> {
    const response = await this.searchWorkoutsUseCase.execute({
      userId: req['user'].id,
      ...data,
    });

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to search variants products with params  ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to search variants products with params ${JSON.stringify(data)} `,
    );

    return response.value;
  }
}
