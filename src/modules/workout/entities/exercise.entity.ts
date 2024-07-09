import { BaseEntity, BaseEntityProps } from '@shared/base.entity';
import { randomUUID } from 'crypto';

export interface ExerciseEntityProps extends BaseEntityProps {
  name: string;
  sets: number;
  reps: number;
  restTime: string;
  techniques: string;
  updatedAt: Date;
  deletedAt?: Date;
}

export class ExerciseEntity extends BaseEntity {
  private name: ExerciseEntityProps['name'];
  private sets: ExerciseEntityProps['sets'];
  private reps: ExerciseEntityProps['sets'];
  private restTime: ExerciseEntityProps['restTime'];
  private techniques: ExerciseEntityProps['techniques'];
  private updatedAt: ExerciseEntityProps['updatedAt'];
  private deletedAt: ExerciseEntityProps['deletedAt'];

  constructor(data: ExerciseEntityProps) {
    super(data);
    this.name = data.name;
    this.sets = data.sets;
    this.reps = data.reps;
    this.restTime = data.restTime;
    this.techniques = data.techniques;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  static CreateNew(
    data: Omit<
      ExerciseEntityProps,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
    id = randomUUID(),
  ): ExerciseEntity {
    return new ExerciseEntity({
      id: id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static CreateFrom(data: ExerciseEntityProps): ExerciseEntity {
    return new ExerciseEntity({
      id: data.id,
      name: data.name,
      reps: data.reps,
      restTime: data.restTime,
      sets: data.sets,
      techniques: data.techniques,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  public serialize(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      reps: this.reps,
      restTime: this.restTime,
      sets: this.sets,
      techniques: this.techniques,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getSets(): number {
    return this.sets;
  }

  public getReps(): number {
    return this.reps;
  }

  public getRestTime(): string {
    return this.restTime;
  }

  public getTechniques(): string {
    return this.techniques;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }
}
