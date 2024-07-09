import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { FindWorkoutByIdDTo, OutputWorkoutDto } from '../dtos/workout.dto';
import { Either, left, right } from '@shared/either';

import { WorkoutRepositoryInterface } from '../interfaces/workout.repository.interface';
import { Inject } from '@nestjs/common';

export class FindByIdWorkoutUseCase
  implements BaseUseCase<FindWorkoutByIdDTo, Either<Error, OutputWorkoutDto>>
{
  constructor(
    @Inject('workoutRepository')
    private readonly workoutRepository: WorkoutRepositoryInterface,
  ) {}

  async execute(
    input: FindWorkoutByIdDTo,
  ): Promise<Either<Error, OutputWorkoutDto>> {
    const workoutModel = await this.workoutRepository.findById(input.id);

    if (workoutModel.isLeft()) {
      return left(workoutModel.value);
    }

    return right({
      id: workoutModel.value.getId(),
      name: workoutModel.value.getName(),
      user: {
        email: workoutModel.value.getUser().getId(),
        createdAt: workoutModel.value.getUser().getCreatedAt(),
        deletedAt: workoutModel.value.getUser().getDeletedAt(),
        name: workoutModel.value.getUser().getName(),
        updatedAt: workoutModel.value.getUser().getUpdatedAt(),
      },
      createdAt: workoutModel.value.getCreatedAt(),
      updatedAt: workoutModel.value.getUpdatedAt(),
      deletedAt: workoutModel.value.getDeletedAt(),
    });
  }
}
