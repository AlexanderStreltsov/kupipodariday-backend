import { Min, IsNumber, IsBoolean } from 'class-validator';
import {
  mustBeNumber,
  mustBeMin,
  mustBeBoolean,
} from '../../constants/error-messages';

export class CreateOfferDto {
  @IsNumber({}, { message: mustBeNumber('amount') })
  @Min(1, { message: mustBeMin('amount', 1) })
  amount: number;

  @IsBoolean({ message: mustBeBoolean('hidden') })
  hidden?: boolean;

  @IsNumber({}, { message: mustBeNumber('number') })
  itemId: number;
}
