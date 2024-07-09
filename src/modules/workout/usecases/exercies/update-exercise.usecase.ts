import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';

import { Either, left, right } from '@shared/either';

import { Inject } from '@nestjs/common';

import {
  OutputExerciseDto,
  UpdateExerciseByIdDto,
} from '@modules/workout/dtos/exercise.dto';
import { ExerciseRepositoryInterface } from '@modules/workout/interfaces/exercise.repository.interface';

export class UpdateExerciseUseCase
  implements
    BaseUseCase<UpdateExerciseByIdDto, Either<Error, OutputExerciseDto>>
{
  constructor(
    @Inject('exerciseRepository')
    private readonly exerciseRepository: ExerciseRepositoryInterface,
  ) {}

  async execute(
    input: UpdateExerciseByIdDto,
  ): Promise<Either<Error, OutputExerciseDto>> {
    const exercise = await this.exerciseRepository.findById(input.id);

    if (exercise.isLeft()) {
      return left(exercise.value);
    }

    exercise.value.Update(input);

    const exerciseUpdate = await this.exerciseRepository.update(exercise.value);

    if (exerciseUpdate.isLeft()) {
      return left(exerciseUpdate.value);
    }

    return right({
      id: exerciseUpdate.value.getId(),
      name: exerciseUpdate.value.getName(),
      reps: exerciseUpdate.value.getReps(),
      restTime: exerciseUpdate.value.getRestTime(),
      sets: exerciseUpdate.value.getSets(),
      techniques: exerciseUpdate.value.getTechniques(),
      workoutId: exerciseUpdate.value.getWorkoutId(),
      createdAt: exerciseUpdate.value.getCreatedAt(),
      updatedAt: exerciseUpdate.value.getUpdatedAt(),
      deletedAt: exerciseUpdate.value.getDeletedAt(),
    });
  }
}
