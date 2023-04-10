import {
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
  IsNumber,
  IsPositive,
  Min,
  IsOptional,
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

export class UpdateWishDto {
  @IsString({ message: mustBeString('name') })
  @MinLength(1, { message: mustBeMinLength('name', 1) })
  @MaxLength(250, { message: mustBeMaxLength('name', 250) })
  @IsOptional()
  name?: string;

  @IsString({ message: mustBeString('link') })
  @IsUrl({}, { message: mustBeUrl('link') })
  @IsOptional()
  link?: string;

  @IsString({ message: mustBeString('image') })
  @IsUrl({}, { message: mustBeUrl('image') })
  @IsOptional()
  image?: string;

  @Min(1, { message: mustBeMin('price', 1) })
  @IsNumber({}, { message: mustBeNumber('price') })
  @IsPositive({ message: mustBePositive('price') })
  @IsOptional()
  price?: number;

  @IsString({ message: mustBeString('description') })
  @IsOptional()
  description?: string;
}
