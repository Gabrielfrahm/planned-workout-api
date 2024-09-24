import { Either, left, right } from '@shared/either';
import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import {
  CreateCommandAuthGoogleDto,
  OutputAuthGoogleDto,
} from '../dtos/auth-google';
import { Inject } from '@nestjs/common';
import { JwtInterface } from '../interfaces/jwt.interface';
import { UserRepositoryInterface } from '@modules/user/interfaces/user.repository.interface';
import { UserTokenRepositoryInterface } from '../interfaces/userToken.reposioty.interface';
import { UserEntity } from '@modules/user/entities/user.entity';

export class AuthGoogle
  implements
    BaseUseCase<CreateCommandAuthGoogleDto, Either<Error, OutputAuthGoogleDto>>
{
  constructor(
    @Inject('jwtService') private readonly jwtService: JwtInterface,
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('userTokenRepository')
    private readonly userTokenRepository: UserTokenRepositoryInterface,
  ) {}

  async execute(
    input: CreateCommandAuthGoogleDto,
  ): Promise<Either<Error, OutputAuthGoogleDto>> {
    let user = await this.userRepository.findByEmail(input.email);

    if (user.isLeft()) {
      user = await this.userRepository.create(UserEntity.CreateNew(input));
      if (user.isLeft()) {
        return left(user.value);
      }
    }

    const token = await this.jwtService.generateToken(
      { id: user.value.getId() },
      '7d',
    );

    if (token.isLeft()) {
      return left(token.value);
    }

    const modelToken = await this.userTokenRepository.create(
      token.value,
      user.value.getId(),
    );

    if (modelToken.isLeft()) {
      return left(modelToken.value);
    }

    return right({
      user: {
        email: user.value.getEmail(),
        name: user.value.getName(),
        createdAt: user.value.getCreatedAt(),
        updatedAt: user.value.getUpdatedAt(),
        deletedAt: user.value.getDeletedAt(),
      },
      token: token.value,
    });
  }
}
