import { OutputUserDto } from '@modules/user/dtos/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommandAuthDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class OutputAuthDto {
  @IsNotEmpty()
  user: OutputUserDto;

  @IsString()
  token: string;
}
