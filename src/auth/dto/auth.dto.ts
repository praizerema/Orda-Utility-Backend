import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthSignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  last_name: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class AuthSignInDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
