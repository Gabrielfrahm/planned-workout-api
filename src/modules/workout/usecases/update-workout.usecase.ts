import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { OutputWorkoutDto, UpdateWorkoutByIdDto } from '../dtos/workout.dto';
import { Either, left, right } from '@shared/either';

import { WorkoutRepositoryInterface } from '../interfaces/workout.repository.interface';
import { Inject } from '@nestjs/common';

export class UpdateWorkoutUseCase
  implements BaseUseCase<UpdateWorkoutByIdDto, Either<Error, OutputWorkoutDto>>
{
  constructor(
    @Inject('workoutRepository')
    private readonly workoutRepository: WorkoutRepositoryInterface,
  ) {}

  async execute(
    input: UpdateWorkoutByIdDto,
  ): Promise<Either<Error, OutputWorkoutDto>> {
    const workout = await this.workoutRepository.findById(input.id);

    if (workout.isLeft()) {
      return left(workout.value);
    }

    workout.value.Update(input.name);

    const workoutUpdate = await this.workoutRepository.update(workout.value);

    if (workoutUpdate.isLeft()) {
      return left(workoutUpdate.value);
    }

    return right({
      id: workoutUpdate.value.getId(),
      name: workoutUpdate.value.getName(),
      user: {
        email: workoutUpdate.value.getUser().getId(),
        createdAt: workoutUpdate.value.getUser().getCreatedAt(),
        deletedAt: workoutUpdate.value.getUser().getDeletedAt(),
        name: workoutUpdate.value.getUser().getName(),
        updatedAt: workoutUpdate.value.getUser().getUpdatedAt(),
      },
      createdAt: workoutUpdate.value.getCreatedAt(),
      updatedAt: workoutUpdate.value.getUpdatedAt(),
      deletedAt: workoutUpdate.value.getDeletedAt(),
    });
  }
}
