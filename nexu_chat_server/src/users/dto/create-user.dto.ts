import { IsString, IsEmail, MinLength, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  uuid: string;
  
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
