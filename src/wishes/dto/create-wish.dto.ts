import {
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';
import {
  mustBeString,
  mustBeUrl,
  mustBeNumber,
  mustBePositive,
  mustBeMin,
  mustBeMinLength,
  mustBeMaxLength,
} from '../../constants/error-messages';

export class CreateWishDto {
  @IsString({ message: mustBeString('name') })
  @MinLength(1, { message: mustBeMinLength('name', 1) })
  @MaxLength(250, { message: mustBeMaxLength('name', 250) })
  name: string;

  @IsString({ message: mustBeString('link') })
  @IsUrl({}, { message: mustBeUrl('link') })
  link: string;

  @IsString({ message: mustBeString('image') })
  @IsUrl({}, { message: mustBeUrl('image') })
  image: string;

  @Min(1, { message: mustBeMin('price', 1) })
  @IsNumber({}, { message: mustBeNumber('price') })
  @IsPositive({ message: mustBePositive('price') })
  price: number;

  @IsString({ message: mustBeString('description') })
  description: string;
}
