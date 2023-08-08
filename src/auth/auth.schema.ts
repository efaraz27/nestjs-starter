import { IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class AuthRegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
