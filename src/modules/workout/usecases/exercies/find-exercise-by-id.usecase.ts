import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { Either, left, right } from '@shared/either';
import { Inject } from '@nestjs/common';

import {
  FindExerciseByIdDto,
  OutputExerciseDto,
} from '@modules/workout/dtos/exercise.dto';
import { ExerciseRepositoryInterface } from '@modules/workout/interfaces/exercise.repository.interface';

export class FindExerciseByIdUseCase
  implements BaseUseCase<FindExerciseByIdDto, Either<Error, OutputExerciseDto>>
{
  constructor(
    @Inject('exerciseRepository')
    private readonly exerciseRepository: ExerciseRepositoryInterface,
  ) {}

  async execute(
    input: FindExerciseByIdDto,
  ): Promise<Either<Error, OutputExerciseDto>> {
    const exercise = await this.exerciseRepository.findById(input.id);

    if (exercise.isLeft()) {
      return left(exercise.value);
    }

    return right({
      id: exercise.value.getId(),
      name: exercise.value.getName(),
      reps: exercise.value.getReps(),
      restTime: exercise.value.getRestTime(),
      sets: exercise.value.getSets(),
      techniques: exercise.value.getTechniques(),
      workoutId: exercise.value.getWorkoutId(),
      createdAt: exercise.value.getCreatedAt(),
      updatedAt: exercise.value.getUpdatedAt(),
      deletedAt: exercise.value.getDeletedAt(),
    });
  }
}
