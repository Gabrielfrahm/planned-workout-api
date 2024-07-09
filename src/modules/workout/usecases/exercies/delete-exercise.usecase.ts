import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { Either, left, right } from '@shared/either';

import { Inject } from '@nestjs/common';
import { DeleteExerciseByIdDto } from '@modules/workout/dtos/exercise.dto';
import { ExerciseRepositoryInterface } from '@modules/workout/interfaces/exercise.repository.interface';

export class DeleteByIdExerciseUseCase
  implements BaseUseCase<DeleteExerciseByIdDto, Either<Error, void>>
{
  constructor(
    @Inject('exerciseRepository')
    private readonly exerciseRepository: ExerciseRepositoryInterface,
  ) {}

  async execute(input: DeleteExerciseByIdDto): Promise<Either<Error, void>> {
    const exerciseModel = await this.exerciseRepository.delete(input.id);

    if (exerciseModel.isLeft()) {
      return left(exerciseModel.value);
    }

    return right(null);
  }
}
