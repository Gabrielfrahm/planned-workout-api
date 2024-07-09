import { LoggingModule } from '@modules/logger/logger.module';
import { Module } from '@nestjs/common';
import { WorkoutsController } from './controller/workout.controller';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { CreateWorkoutUseCase } from './usecases/create-workout.usecase';
import { WorkoutRepository } from './repositories/workout.repository';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { FindByIdWorkoutUseCase } from './usecases/find-by-id-workout.usecase';
import { DeleteByIdWorkoutUseCase } from './usecases/delete-workout.usecase';
import { SearchWorkoutsUseCase } from './usecases/search-workout.usecase';
import { ExercisesController } from './controller/exercise.controller';
import { ExerciseRepository } from './repositories/exercise.repository';
import { CreateExerciseUseCase } from './usecases/exercies/create-exercise.usecase';

@Module({
  imports: [LoggingModule, UserModule, AuthModule],
  controllers: [WorkoutsController, ExercisesController],
  providers: [
    PrismaService,
    {
      provide: 'workoutRepository',
      useFactory: (prismaService: PrismaService): WorkoutRepository =>
        new WorkoutRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: 'exerciseRepository',
      useFactory: (prismaService: PrismaService): ExerciseRepository =>
        new ExerciseRepository(prismaService),
      inject: [PrismaService],
    },
    CreateWorkoutUseCase,
    FindByIdWorkoutUseCase,
    DeleteByIdWorkoutUseCase,
    SearchWorkoutsUseCase,
    CreateExerciseUseCase,
  ],
  exports: ['workoutRepository', 'exerciseRepository'],
})
export class WorkoutModule {}
