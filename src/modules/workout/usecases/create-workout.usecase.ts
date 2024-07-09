import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { CreateWorkoutDto, OutputWorkoutDto } from '../dtos/workout.dto';
import { Either, left, right } from '@shared/either';

import { WorkoutRepositoryInterface } from '../interfaces/workout.repository.interface';
import { Inject } from '@nestjs/common';
import { WorkOutEntity } from '../entities/workouts.entity';
import { UserRepositoryInterface } from '@modules/user/interfaces/user.repository.interface';

export class CreateWorkoutUseCase
  implements BaseUseCase<CreateWorkoutDto, Either<Error, OutputWorkoutDto>>
{
  constructor(
    @Inject('workoutRepository')
    private readonly workoutRepository: WorkoutRepositoryInterface,
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(
    input: CreateWorkoutDto,
  ): Promise<Either<Error, OutputWorkoutDto>> {
    const user = await this.userRepository.findById(input.userId);

    if (user.isLeft()) {
      return left(user.value);
    }

    const workout = WorkOutEntity.CreateNew({
      name: input.name,
      user: user.value,
    });

    const workoutModel = await this.workoutRepository.create(workout);

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
