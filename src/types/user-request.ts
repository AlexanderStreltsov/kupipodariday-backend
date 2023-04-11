import { User } from '../users/entities/user.entity';

export interface IUserRequest extends Request {
  user: User;
}
