import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { OutputUserDto } from '@modules/user/dtos/user.dto';

export class CreateWorkoutDto {
  @IsUUID(4)
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class OutputWorkoutDto {
  @IsUUID(4)
  id: string;

  @IsNotEmpty()
  user: OutputUserDto;

  @IsString()
  @IsNotEmpty()
  name: string;
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsDate()
  @IsOptional()
  deletedAt?: Date;
}

export class SearchWorkoutsDto {
  @IsUUID(4)
  userId: string;

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
  deletedAt?: boolean;

  @IsOptional()
  noPaginate?: boolean;
}

export class OutputSearchWorkoutsDto {
  data: OutputWorkoutDto[];
  meta: {
    page: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}

export class FindWorkoutByIdDTo {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;
}

export class DeleteWorkoutByIdDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;
}

export class UpdateWorkoutByIdDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
