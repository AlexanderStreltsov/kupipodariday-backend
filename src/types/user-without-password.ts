import { User } from '../users/entities/user.entity';

export type TUserWithoutPass = Omit<User, 'password'>;
