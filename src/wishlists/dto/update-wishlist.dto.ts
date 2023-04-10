import {
  IsArray,
  IsString,
  IsUrl,
  MaxLength,
  IsOptional,
} from 'class-validator';
import {
  mustBeString,
  mustBeUrl,
  mustBeArray,
  mustBeMaxLength,
} from '../../constants/error-messages';

export class UpdateWishlistDto {
  @IsString({ message: mustBeString('name') })
  @IsOptional()
  name?: string;

  @IsString({ message: mustBeString('image') })
  @IsUrl({}, { message: mustBeUrl('image') })
  @IsOptional()
  image?: string;

  @IsString({ message: mustBeString('image') })
  @MaxLength(1500, { message: mustBeMaxLength('description', 1500) })
  @IsOptional()
  description?: string;

  @IsArray({ message: mustBeArray('itemsId') })
  @IsOptional()
  itemsId?: number[];
}
