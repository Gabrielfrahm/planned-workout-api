import { Either } from '@shared/either';

import { ExerciseEntity } from '../entities/exercise.entity';

export interface ExerciseRepositoryInterface {
  create(exercise: ExerciseEntity): Promise<Either<Error, ExerciseEntity>>;
  // findById(id: string): Promise<Either<Error, WorkOutEntity>>;
  // delete(id: string): Promise<Either<Error, void>>;
  // // list(
  //   params?: SearchWorkoutsDto,
  // ): Promise<Either<Error, Search<WorkOutEntity>>>;
}
