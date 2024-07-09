import { Either, left, right } from '@shared/either';

import { PrismaService } from '@modules/database/prisma/prisma.service';
import { ExerciseRepositoryInterface } from '../interfaces/exercise.repository.interface';
import { ExerciseEntity } from '../entities/exercise.entity';
import { RepositoryException } from '@shared/exceptions/repository.exception';
import { SearchExerciseDto } from '../dtos/exercise.dto';
import { Search } from '@shared/interfaces/search.interface';

export class ExerciseRepository implements ExerciseRepositoryInterface {
  private model: PrismaService['exercises'];
  private connection: PrismaService;

  constructor(prismaService: PrismaService) {
    this.model = prismaService.exercises;
    this.connection = prismaService;
  }

  async create(
    exercise: ExerciseEntity,
  ): Promise<Either<Error, ExerciseEntity>> {
    try {
      const exerciseModel = await this.model.create({
        data: {
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
        },
        include: {
          workout: true,
        },
      });

      return right(
        ExerciseEntity.CreateFrom({
          id: exerciseModel.id,
          name: exerciseModel.name,
          reps: exerciseModel.reps,
          restTime: exerciseModel.restTime,
          sets: exerciseModel.sets,
          techniques: exerciseModel.techniques,
          workoutId: exerciseModel.workoutId,
          createdAt: exerciseModel.createdAt,
          updatedAt: exerciseModel.updatedAt,
          deletedAt: exerciseModel.deletedAt,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async findById(id: string): Promise<Either<Error, ExerciseEntity>> {
    try {
      const exercise = await this.model.findUnique({
        where: {
          id: id,
        },
        include: {
          workout: true,
        },
      });

      if (!exercise) {
        return left(
          new RepositoryException(`exercise not found for this id ${id}`, 404),
        );
      }

      return right(
        ExerciseEntity.CreateFrom({
          id: exercise.id,
          name: exercise.name,
          reps: exercise.reps,
          restTime: exercise.restTime,
          sets: exercise.sets,
          techniques: exercise.techniques,
          workoutId: exercise.workoutId,
          createdAt: exercise.createdAt,
          updatedAt: exercise.updatedAt,
          deletedAt: exercise.deletedAt,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async list({
    page = 1,
    perPage = 10,
    workoutId,
    name,
    reps,
    restTime,
    sets,
    techniques,
    deletedAt,
    sort,
    sortDir,
  }: SearchExerciseDto): Promise<Either<Error, Search<ExerciseEntity>>> {
    const skip = (page - 1) * perPage;
    const take = Number(perPage);

    const filters: any = {
      workoutId: workoutId,
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
      ...(reps && {
        reps: {
          equals: Number(reps),
        },
      }),
      ...(restTime && {
        restTime: {
          mode: 'insensitive',
          contains: restTime,
        },
      }),
      ...(sets && {
        sets: {
          equals: Number(sets),
        },
      }),
      ...(techniques && {
        techniques: {
          mode: 'insensitive',
          contains: techniques,
        },
      }),
    };

    try {
      const [exercises, count] = await this.connection.$transaction([
        this.model.findMany({
          where: filters,
          orderBy: {
            [sort ?? 'createdAt']: sortDir ?? 'desc',
          },
          skip: skip,
          take: take,
          include: {
            workout: true,
          },
        }),
        this.model.count({
          where: filters,
        }),
      ]);

      const lastPage = Math.ceil(count / take);

      return right({
        data: exercises.map((exercise) =>
          ExerciseEntity.CreateFrom({
            id: exercise.id,
            name: exercise.name,
            reps: exercise.reps,
            restTime: exercise.restTime,
            sets: exercise.sets,
            techniques: exercise.techniques,
            workoutId: exercise.workoutId,
            createdAt: exercise.createdAt,
            updatedAt: exercise.updatedAt,
            deletedAt: exercise.deletedAt,
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

  async delete(id: string): Promise<Either<Error, void>> {
    try {
      const findExercise = await this.model.findUnique({
        where: {
          id,
        },
      });

      if (!findExercise) {
        return left(
          new RepositoryException(`exercise not  found for this id ${id}`, 404),
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
}
