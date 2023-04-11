import { type TUserWithoutPass } from './user-without-password';

export type TUserWithoutEmailAndPass = Omit<TUserWithoutPass, 'email'>;
