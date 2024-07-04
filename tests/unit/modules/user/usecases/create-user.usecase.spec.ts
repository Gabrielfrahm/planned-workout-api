import { CreateUserDto } from '@modules/user/dtos/user.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { UserRepositoryInterface } from '@modules/user/interfaces/user.repository.interface';
import { CreateUserUseCase } from '@modules/user/usecases/create-user.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { left, right } from '@shared/either';

import { RepositoryException } from '@shared/exceptions/repository.exception';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: UserRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'userRepository',
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<UserRepositoryInterface>('userRepository');
  });

  describe('execute', () => {
    it('should return right with OutputUserDto on successful creation', async () => {
      const input: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const userEntity = UserEntity.CreateNew(input);

      jest.spyOn(userRepository, 'create').mockResolvedValue(right(userEntity));

      const result = await useCase.execute(input);

      expect(result.isRight()).toBeTruthy();
      expect({
        email: result.value['email'],
        name: result.value['name'],
      }).toEqual({
        email: input.email,
        name: input.name,
      });
    });

    it('should return left with error if user creation fails', async () => {
      const input: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const error = new RepositoryException(
        `User Already existing with e-mail: ${input.email}`,
        404,
      );

      jest.spyOn(userRepository, 'create').mockResolvedValue(left(error));

      const result = await useCase.execute(input);

      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBe(error);
    });
  });
});
