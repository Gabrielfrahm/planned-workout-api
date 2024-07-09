import { Either } from '@shared/either';
import { WorkOutEntity } from '../entities/workouts.entity';
import { Search } from '@shared/interfaces/search.interface';
import { SearchWorkoutsDto } from '../dtos/workout.dto';

export interface WorkoutRepositoryInterface {
  create(user: WorkOutEntity): Promise<Either<Error, WorkOutEntity>>;
  findById(id: string): Promise<Either<Error, WorkOutEntity>>;
  delete(id: string): Promise<Either<Error, void>>;
  list(
    params?: SearchWorkoutsDto,
  ): Promise<Either<Error, Search<WorkOutEntity>>>;
}
