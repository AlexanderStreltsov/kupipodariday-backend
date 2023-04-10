import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';
import {
  mustBeEmail,
  mustBeString,
  mustBeMinLength,
  mustBeMaxLength,
  mustBeUrl,
  mustBeNotEmpty,
} from '../../constants/error-messages';

export class CreateUserDto {
  @IsString({ message: mustBeString('email') })
  @IsEmail({}, { message: mustBeEmail('email') })
  email: string;

  @IsString({ message: mustBeString('password') })
  @IsNotEmpty({ message: mustBeNotEmpty('password') })
  password: string;

  @IsString({ message: mustBeString('username') })
  @MinLength(2, { message: mustBeMinLength('username', 2) })
  @MaxLength(30, { message: mustBeMaxLength('username', 30) })
  username: string;

  @IsString({ message: mustBeString('avatar') })
  @IsUrl({}, { message: mustBeUrl('avatar') })
  @IsOptional()
  avatar?: string;

  @IsString({ message: mustBeString('about') })
  @MinLength(2, { message: mustBeMinLength('about', 2) })
  @MaxLength(200, { message: mustBeMaxLength('about', 200) })
  @IsOptional()
  about?: string;
}
