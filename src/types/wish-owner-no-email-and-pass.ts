import { Wish } from '../wishes/entities/wish.entity';
import { type TUserWithoutEmailAndPass } from './user-without-email-and-pass';

export type TWishWithOwnerNoEmailAndPass = Omit<Wish, 'owner'> & {
  owner: TUserWithoutEmailAndPass;
};
