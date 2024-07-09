import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';

import { Either, left, right } from '@shared/either';

import { Inject } from '@nestjs/common';

import {
  CreateExerciseDto,
  OutputExerciseDto,
} from '@modules/workout/dtos/exercise.dto';
import { ExerciseRepositoryInterface } from '@modules/workout/interfaces/exercise.repository.interface';
import { ExerciseEntity } from '@modules/workout/entities/exercise.entity';
import { WorkoutRepositoryInterface } from '@modules/workout/interfaces/workout.repository.interface';

export class CreateExerciseUseCase
  implements BaseUseCase<CreateExerciseDto, Either<Error, OutputExerciseDto>>
{
  constructor(
    @Inject('workoutRepository')
    private readonly workoutRepository: WorkoutRepositoryInterface,
    @Inject('exerciseRepository')
    private readonly exerciseRepository: ExerciseRepositoryInterface,
  ) {}

  async execute(
    input: CreateExerciseDto,
  ): Promise<Either<Error, OutputExerciseDto>> {
    const workout = await this.workoutRepository.findById(input.workoutId);

    if (workout.isLeft()) {
      return left(workout.value);
    }

    const exercise = ExerciseEntity.CreateNew({
      ...input,
      workoutId: workout.value.getId(),
    });

    const exerciseModel = await this.exerciseRepository.create(exercise);

    if (exerciseModel.isLeft()) {
      return left(exerciseModel.value);
    }

    return right({
      id: exerciseModel.value.getId(),
      name: exerciseModel.value.getName(),
      reps: exerciseModel.value.getReps(),
      restTime: exerciseModel.value.getRestTime(),
      sets: exerciseModel.value.getSets(),
      techniques: exerciseModel.value.getTechniques(),
      workoutId: exerciseModel.value.getWorkoutId(),
      createdAt: exerciseModel.value.getCreatedAt(),
      updatedAt: exerciseModel.value.getUpdatedAt(),
      deletedAt: exerciseModel.value.getDeletedAt(),
    });
  }
}
