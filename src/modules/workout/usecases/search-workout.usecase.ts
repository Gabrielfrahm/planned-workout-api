import { Inject, Injectable } from '@nestjs/common';
import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import {
  OutputSearchWorkoutsDto,
  SearchWorkoutsDto,
} from '../dtos/workout.dto';
import { Either, left, right } from '@shared/either';
import { WorkoutRepositoryInterface } from '../interfaces/workout.repository.interface';

@Injectable()
export class SearchWorkoutsUseCase
  implements
    BaseUseCase<SearchWorkoutsDto, Either<Error, OutputSearchWorkoutsDto>>
{
  constructor(
    @Inject('workoutRepository')
    private readonly workoutRepository: WorkoutRepositoryInterface,
  ) {}

  async execute(
    input: SearchWorkoutsDto,
  ): Promise<Either<Error, OutputSearchWorkoutsDto>> {
    const workouts = await this.workoutRepository.list(input);

    if (workouts.isLeft()) {
      return left(workouts.value);
    }

    return right({
      data: workouts.value.data.map((workout) => ({
        id: workout.getId(),
        name: workout.getName(),
        user: {
          email: workout.getUser().getId(),
          createdAt: workout.getUser().getCreatedAt(),
          deletedAt: workout.getUser().getDeletedAt(),
          name: workout.getUser().getName(),
          updatedAt: workout.getUser().getUpdatedAt(),
        },
        createdAt: workout.getCreatedAt(),
        updatedAt: workout.getUpdatedAt(),
        deletedAt: workout.getDeletedAt(),
      })),
      meta: workouts.value.meta,
    });
  }
}
