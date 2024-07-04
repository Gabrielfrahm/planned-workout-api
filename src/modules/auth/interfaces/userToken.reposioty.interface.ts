import { Either } from '@shared/either';

export interface UserTokenRepositoryInterface {
  create(token: string, userId: string): Promise<Either<Error, unknown>>;
}
