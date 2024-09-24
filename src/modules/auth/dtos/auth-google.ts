import { OutputUserDto } from '@modules/user/dtos/user.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommandAuthGoogleDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class OutputAuthGoogleDto {
  @IsNotEmpty()
  user: OutputUserDto;

  @IsString()
  token: string;
}
