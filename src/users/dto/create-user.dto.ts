import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(2, {
    message: 'Имя пользователя должно быть не менее 2 символов',
  })
  @MaxLength(30, {
    message: 'Имя пользователя должно быть не более 30 символов',
  })
  username: string;

  @IsString()
  @IsOptional()
  avatar?: 'https://i.pravatar.cc/150';

  @IsString()
  @IsOptional()
  @MinLength(2, {
    message: 'Описание профиля должно быть не менее 2 символов',
  })
  @MaxLength(200, {
    message: 'Описание профиля должно быть не более 200 символов',
  })
  about?: string;
}
