import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  userID: string;

  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  password: string;

  @IsEnum(['user', 'admin'], { message: 'Enter valid role!' })
  @IsOptional()
  role: 'user' | 'admin' = 'user';
}

// export interface IUser{
// userID:string;
// name:string;
// title:string;
// }
