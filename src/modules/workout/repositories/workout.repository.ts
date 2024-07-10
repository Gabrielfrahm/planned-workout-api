import { Either, left, right } from '@shared/either';
import { Search } from '@shared/interfaces/search.interface';
import { SearchWorkoutsDto } from '../dtos/workout.dto';
import { WorkOutEntity } from '../entities/workouts.entity';
import { WorkoutRepositoryInterface } from '../interfaces/workout.repository.interface';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserEntity } from '@modules/user/entities/user.entity';
import { RepositoryException } from '@shared/exceptions/repository.exception';

export class WorkoutRepository implements WorkoutRepositoryInterface {
  private model: PrismaService['workouts'];
  private connection: PrismaService;

  constructor(prismaService: PrismaService) {
    this.model = prismaService.workouts;
    this.connection = prismaService;
  }

  async create(workout: WorkOutEntity): Promise<Either<Error, WorkOutEntity>> {
    try {
      const workoutModel = await this.model.create({
        data: {
          id: workout.getId(),
          userId: workout.getUser().getId(),
          name: workout.getName(),
          createdAt: workout.getCreatedAt(),
          updatedAt: workout.getUpdatedAt(),
          deletedAt: workout.getDeletedAt(),
        },
        include: {
          user: true,
        },
      });

      return right(
        WorkOutEntity.CreateFrom({
          id: workoutModel.id,
          name: workoutModel.name,
          createdAt: workoutModel.createdAt,
          updatedAt: workoutModel.updatedAt,
          user: UserEntity.CreateFrom({
            ...workoutModel.user,
          }),
          deletedAt: workoutModel.deletedAt,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async findById(id: string): Promise<Either<Error, WorkOutEntity>> {
    try {
      const workoutModel = await this.model.findFirst({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
      });

      if (!workoutModel) {
        return left(
          new RepositoryException(`workout not  found for this id ${id}`, 404),
        );
      }

      return right(
        WorkOutEntity.CreateFrom({
          id: workoutModel.id,
          name: workoutModel.name,
          createdAt: workoutModel.createdAt,
          updatedAt: workoutModel.updatedAt,
          user: UserEntity.CreateFrom({
            ...workoutModel.user,
          }),
          deletedAt: workoutModel.deletedAt,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async delete(id: string): Promise<Either<Error, void>> {
    try {
      const findWorkout = await this.model.findUnique({
        where: {
          id,
        },
      });

      if (!findWorkout) {
        return left(
          new RepositoryException(`workout not  found for this id ${id}`, 404),
        );
      }

      await this.model.delete({
        where: {
          id,
        },
      });

      return right(null);
    } catch (e) {
      return left(e);
    }
  }

  async list({
    page = 1,
    perPage = 10,
    userId,
    name,
    deletedAt,
    sort,
    sortDir,
  }: SearchWorkoutsDto): Promise<Either<Error, Search<WorkOutEntity>>> {
    const skip = (page - 1) * perPage;
    const take = Number(perPage);

    const filters: any = {
      userId: userId,
      deletedAt: null,
      ...(deletedAt && {
        deletedAt: {
          not: null,
        },
      }),
      ...(name && {
        name: {
          mode: 'insensitive',
          contains: name,
        },
      }),
    };

    try {
      const [workouts, count] = await this.connection.$transaction([
        this.model.findMany({
          where: filters,
          orderBy: {
            [sort ?? 'createdAt']: sortDir ?? 'desc',
          },
          skip: skip,
          take: take,
          include: {
            user: true,
          },
        }),
        this.model.count({
          where: filters,
        }),
      ]);

      const lastPage = Math.ceil(count / take);

      return right({
        data: workouts.map((workout) =>
          WorkOutEntity.CreateFrom({
            id: workout.id,
            name: workout.name,
            createdAt: workout.createdAt,
            updatedAt: workout.updatedAt,
            user: UserEntity.CreateFrom({
              ...workout.user,
            }),
            deletedAt: workout.deletedAt,
          }),
        ),
        meta: {
          page: page,
          perPage: take,
          total: count,
          lastPage: lastPage,
        },
      });
    } catch (e) {
      return left(e);
    }
  }

  async update(workout: WorkOutEntity): Promise<Either<Error, WorkOutEntity>> {
    try {
      const workoutModel = await this.model.findFirst({
        where: {
          id: workout.getId(),
        },
        include: {
          user: true,
        },
      });

      if (!workoutModel) {
        return left(
          new RepositoryException(
            `workout not  found for this id ${workout.getId()}`,
            404,
          ),
        );
      }

      const workoutUpdates = await this.model.update({
        where: {
          id: workoutModel.id,
        },
        data: {
          name: workout.getName(),
          updatedAt: workout.getUpdatedAt(),
        },
        include: {
          user: true,
        },
      });

      return right(
        WorkOutEntity.CreateFrom({
          id: workoutUpdates.id,
          name: workoutUpdates.name,
          createdAt: workoutUpdates.createdAt,
          updatedAt: workoutUpdates.updatedAt,
          user: UserEntity.CreateFrom({
            ...workoutUpdates.user,
          }),
          deletedAt: workoutUpdates.deletedAt,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }
}
