import { UserTokenRepository } from '@modules/auth/repository/userToken.repository';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryException } from '@shared/exceptions/repository.exception';

describe('user token repository unit test', () => {
  let repository: UserTokenRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTokenRepository,
        {
          provide: PrismaService,
          useValue: {
            userToken: {
              findMany: jest.fn(),
              create: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<UserTokenRepository>(UserTokenRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new token for the user', async () => {
      (prismaService.userToken.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.userToken.create as jest.Mock).mockResolvedValue({
        token: 'token',
        userId: 'userId',
      });

      const result = await repository.create('token', 'userId');
      expect(result.isRight()).toBe(true);
      expect(prismaService.userToken.create).toHaveBeenCalledWith({
        data: { token: 'token', userId: 'userId' },
      });
    });

    it('should delete existing tokens before creating a new one', async () => {
      (prismaService.userToken.findMany as jest.Mock).mockResolvedValue([
        { token: 'oldToken', userId: 'userId' },
      ]);
      (prismaService.userToken.create as jest.Mock).mockResolvedValue({
        token: 'token',
        userId: 'userId',
      });

      const result = await repository.create('token', 'userId');

      expect(result.isRight()).toBe(true);
      expect(prismaService.userToken.findMany).toHaveBeenCalledWith({
        where: { userId: 'userId' },
      });
      expect(prismaService.userToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'userId' },
      });
      expect(prismaService.userToken.create).toHaveBeenCalledWith({
        data: { token: 'token', userId: 'userId' },
      });
    });

    it('should return a RepositoryException on error', async () => {
      (prismaService.userToken.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      const result = await repository.create('token', 'userId');

      expect(result.isLeft()).toBe(true);
      const error = result.value as RepositoryException;
      expect(error.message).toContain('Database error');
    });
  });
});
