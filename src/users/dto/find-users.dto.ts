import { IsString } from 'class-validator';
import { mustBeString } from '../../constants/error-messages';

export class FindUsersDto {
  @IsString({ message: mustBeString('query') })
  query: string;
}
