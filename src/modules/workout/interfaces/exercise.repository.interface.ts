import { Either } from '@shared/either';

import { ExerciseEntity } from '../entities/exercise.entity';
import { SearchExerciseDto } from '../dtos/exercise.dto';
import { Search } from '@shared/interfaces/search.interface';

export interface ExerciseRepositoryInterface {
  create(exercise: ExerciseEntity): Promise<Either<Error, ExerciseEntity>>;
  findById(id: string): Promise<Either<Error, ExerciseEntity>>;
  delete(id: string): Promise<Either<Error, void>>;
  list(
    params?: SearchExerciseDto,
  ): Promise<Either<Error, Search<ExerciseEntity>>>;
  update(exercise: ExerciseEntity): Promise<Either<Error, ExerciseEntity>>;
}
