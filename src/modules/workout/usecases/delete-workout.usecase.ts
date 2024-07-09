import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { DeleteWorkoutByIdDto } from '../dtos/workout.dto';
import { Either, left, right } from '@shared/either';

import { WorkoutRepositoryInterface } from '../interfaces/workout.repository.interface';
import { Inject } from '@nestjs/common';

export class DeleteByIdWorkoutUseCase
  implements BaseUseCase<DeleteWorkoutByIdDto, Either<Error, void>>
{
  constructor(
    @Inject('workoutRepository')
    private readonly workoutRepository: WorkoutRepositoryInterface,
  ) {}

  async execute(input: DeleteWorkoutByIdDto): Promise<Either<Error, void>> {
    const workoutModel = await this.workoutRepository.delete(input.id);

    if (workoutModel.isLeft()) {
      return left(workoutModel.value);
    }

    return right(null);
  }
}
