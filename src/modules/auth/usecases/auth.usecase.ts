import { Either, left, right } from '@shared/either';
import { JwtInterface } from '@modules/auth/interfaces/jwt.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@modules/user/interfaces/user.repository.interface';
import { UserTokenRepositoryInterface } from '../interfaces/userToken.reposioty.interface';

import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { CreateCommandAuthDto, OutputAuthDto } from '../dtos/auth.dto';

@Injectable()
export class Auth
  implements BaseUseCase<CreateCommandAuthDto, Either<Error, OutputAuthDto>>
{
  constructor(
    @Inject('jwtService') private readonly jwtService: JwtInterface,
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('userTokenRepository')
    private readonly userTokenRepository: UserTokenRepositoryInterface,
  ) {}

  async execute(
    input: CreateCommandAuthDto,
  ): Promise<Either<Error, OutputAuthDto>> {
    const user = await this.userRepository.findByEmail(input.email);

    if (user.isLeft()) {
      return left(user.value);
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
