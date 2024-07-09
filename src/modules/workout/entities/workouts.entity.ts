import { UserEntity } from '@modules/user/entities/user.entity';
import { BaseEntity, BaseEntityProps } from '@shared/base.entity';
import { ExerciseEntity } from './exercise.entity';
import { randomUUID } from 'crypto';

export interface WorkOutEntityProps extends BaseEntityProps {
  user: UserEntity;
  name: string;
  exercises?: ExerciseEntity[];
  updatedAt: Date;
  deletedAt?: Date;
}

export class WorkOutEntity extends BaseEntity {
  private user: WorkOutEntityProps['user'];
  private name: WorkOutEntityProps['name'];
  private exercises: WorkOutEntityProps['exercises'];
  private updatedAt: WorkOutEntityProps['updatedAt'];
  private deletedAt: WorkOutEntityProps['deletedAt'];

  constructor(data: WorkOutEntityProps) {
    super(data);
    this.name = data.name;
    this.user = data.user;
    this.exercises = data.exercises;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  static CreateNew(
    data: Omit<
      WorkOutEntityProps,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
    id = randomUUID(),
  ): WorkOutEntity {
    return new WorkOutEntity({
      id: id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static CreateFrom(data: WorkOutEntityProps): WorkOutEntity {
    return new WorkOutEntity({
      id: data.id,
      name: data.name,
      user: data.user,
      exercises: data.exercises,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  public serialize(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      user: this.user,
      exercises: this.exercises,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  // Getters
  public getUser(): UserEntity {
    return this.user;
  }

  public getName(): string {
    return this.name;
  }

  public getExercises(): ExerciseEntity[] {
    return this.exercises;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }
}
