import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@modules/database/prisma/prisma.service';

import { RepositoryException } from '@shared/exceptions/repository.exception';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { UserEntity } from '@modules/user/entities/user.entity';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: PrismaService;

  const date = new Date();
  const data = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: date,
    updatedAt: date,
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should return right with created user entity', async () => {
      const userEntity = UserEntity.CreateFrom({ ...data });

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: date,
        updatedAt: date,
        deletedAt: null,
      });

      const result = await repository.create(userEntity);
      expect(result.isRight()).toBeTruthy();
      expect(result.value).toEqual(userEntity);
    });

    it('should return left with RepositoryException if email already exists', async () => {
      const userEntity = UserEntity.CreateFrom({ ...data });

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: date,
        updatedAt: date,
        deletedAt: null,
      });

      const result = await repository.create(userEntity);
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBeInstanceOf(RepositoryException);
    });
  });

  describe('findByEmail', () => {
    it('should return right with user entity', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: date,
        updatedAt: date,
        deletedAt: null,
      });

      const result = await repository.findByEmail('test@example.com');
      expect(result.isRight()).toBeTruthy();
      if (result.isRight()) {
        expect(result.value.getEmail()).toBe('test@example.com');
      }
    });

    it('should return left with RepositoryException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBeInstanceOf(RepositoryException);
    });
  });

  describe('delete', () => {
    it('should return left with RepositoryException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await repository.delete('1');
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBeInstanceOf(RepositoryException);
    });
  });
});
