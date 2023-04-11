import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { type TUserWithoutEmailAndPass } from './user-without-email-and-pass';

export type TWishlistWithOwnerNoEmailAndPass = Omit<Wishlist, 'owner'> & {
  owner: TUserWithoutEmailAndPass;
};
