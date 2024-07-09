import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateExerciseDto {
  @IsUUID(4)
  @IsNotEmpty()
  workoutId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  sets: number;

  @IsNumber()
  @IsNotEmpty()
  reps: number;

  @IsString()
  @IsNotEmpty()
  restTime: string;

  @IsString()
  @IsNotEmpty()
  techniques: string;
}

export class OutputExerciseDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  sets: number;

  @IsNumber()
  @IsNotEmpty()
  reps: number;

  @IsString()
  @IsNotEmpty()
  restTime: string;

  @IsString()
  @IsNotEmpty()
  techniques: string;
}

export class FindExerciseByIdDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;
}

export class SearchExerciseDto {
  @IsUUID(4)
  workoutId: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  perPage?: number;

  @IsOptional()
  sortDir?: string;

  @IsOptional()
  sort?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  reps?: number;

  @IsOptional()
  restTime?: string;

  @IsOptional()
  sets?: number;

  @IsOptional()
  techniques?: string;

  @IsOptional()
  deletedAt?: boolean;
}

export class OutputSearchExercisesDto {
  data: OutputExerciseDto[];
  meta: {
    page: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}

export class DeleteExerciseByIdDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;
}

export class UpdateExerciseByIdDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  reps?: number;

  @IsOptional()
  restTime?: string;

  @IsOptional()
  sets?: number;

  @IsOptional()
  techniques?: string;
}
