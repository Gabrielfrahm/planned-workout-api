import { Inject, Injectable } from '@nestjs/common';
import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';

import { Either, left, right } from '@shared/either';

import {
  OutputSearchExercisesDto,
  SearchExerciseDto,
} from '@modules/workout/dtos/exercise.dto';
import { ExerciseRepositoryInterface } from '@modules/workout/interfaces/exercise.repository.interface';

@Injectable()
export class SearchExerciseUseCase
  implements
    BaseUseCase<SearchExerciseDto, Either<Error, OutputSearchExercisesDto>>
{
  constructor(
    @Inject('exerciseRepository')
    private readonly exerciseRepository: ExerciseRepositoryInterface,
  ) {}

  async execute(
    input: SearchExerciseDto,
  ): Promise<Either<Error, OutputSearchExercisesDto>> {
    const exercises = await this.exerciseRepository.list(input);

    if (exercises.isLeft()) {
      return left(exercises.value);
    }

    return right({
      data: exercises.value.data.map((exercise) => ({
        id: exercise.getId(),
        name: exercise.getName(),
        reps: exercise.getReps(),
        restTime: exercise.getRestTime(),
        sets: exercise.getSets(),
        techniques: exercise.getTechniques(),
        workoutId: exercise.getWorkoutId(),
        createdAt: exercise.getCreatedAt(),
        updatedAt: exercise.getUpdatedAt(),
        deletedAt: exercise.getDeletedAt(),
      })),
      meta: exercises.value.meta,
    });
  }
}
