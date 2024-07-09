import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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
