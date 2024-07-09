import { Test, TestingModule } from '@nestjs/testing';

import { JwtInterface } from '@modules/auth/interfaces/jwt.interface';
import { UserRepositoryInterface } from '@modules/user/interfaces/user.repository.interface';

import { left, right } from '@shared/either';
import { Auth } from '@modules/auth/usecases/auth.usecase';
import { UserTokenRepositoryInterface } from '@modules/auth/interfaces/userToken.reposioty.interface';
import { CreateCommandAuthDto } from '@modules/auth/dtos/auth.dto';
import { UserEntity } from '@modules/user/entities/user.entity';

describe('Auth', () => {
  let auth: Auth;
  let jwtService: jest.Mocked<JwtInterface>;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let userTokenRepository: jest.Mocked<UserTokenRepositoryInterface>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Auth,
        {
          provide: 'jwtService',
          useValue: {
            generateToken: jest.fn(),
          },
        },
        {
          provide: 'userRepository',
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: 'userTokenRepository',
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    auth = module.get<Auth>(Auth);
    jwtService = module.get('jwtService');
    userRepository = module.get('userRepository');
    userTokenRepository = module.get('userTokenRepository');
  });

  it('should be defined', () => {
    expect(auth).toBeDefined();
  });

  it('should return an error if user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(
      left(new Error('User not found')),
    );

    const input: CreateCommandAuthDto = {
      email: 'test@example.com',
    };
    const result = await auth.execute(input);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new Error('User not found'));
  });

  it('should return an error if token generation fails', async () => {
    userRepository.findByEmail.mockResolvedValue(
      right(
        UserEntity.CreateNew({
          name: 'joe',
          email: 'john@doe.com',
        }),
      ),
    );
    jwtService.generateToken.mockResolvedValue(
      left(new Error('Token generation failed')),
    );

    const input: CreateCommandAuthDto = {
      email: 'test@example.com',
    };
    const result = await auth.execute(input);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new Error('Token generation failed'));
  });

  it('should return an error if saving token fails', async () => {
    userRepository.findByEmail.mockResolvedValue(
      right(
        UserEntity.CreateNew({
          name: 'joe',
          email: 'john@doe.com',
        }),
      ),
    );
    jwtService.generateToken.mockResolvedValue(right('jwt-token'));
    userTokenRepository.create.mockResolvedValue(
      left(new Error('Save token failed')),
    );

    const input: CreateCommandAuthDto = {
      email: 'test@example.com',
    };
    const result = await auth.execute(input);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new Error('Save token failed'));
  });

  it('should return the token on success', async () => {
    userRepository.findByEmail.mockResolvedValue(
      right(
        UserEntity.CreateNew({
          name: 'joe',
          email: 'john@doe.com',
        }),
      ),
    );
    jwtService.generateToken.mockResolvedValue(right('jwt-token'));
    userTokenRepository.create.mockResolvedValue(right({}));

    const input: CreateCommandAuthDto = {
      email: 'test@example.com',
    };
    const result = await auth.execute(input);

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({ token: 'jwt-token' });
  });
});
