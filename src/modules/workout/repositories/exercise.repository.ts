import { Either, left, right } from '@shared/either';

import { PrismaService } from '@modules/database/prisma/prisma.service';
import { ExerciseRepositoryInterface } from '../interfaces/exercise.repository.interface';
import { ExerciseEntity } from '../entities/exercise.entity';

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
}
