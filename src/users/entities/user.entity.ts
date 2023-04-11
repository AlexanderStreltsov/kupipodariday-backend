import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { CommonInfo } from '../../utils';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { USER_ABOUT, USER_AVATAR } from '../../constants/default-values';

@Entity()
export class User extends CommonInfo {
  @Column('varchar', {
    unique: true,
    nullable: false,
  })
  @Length(2, 30)
  username: string;

  @Column('varchar', { default: USER_ABOUT })
  @Length(2, 200)
  about: string;

  @Column({ default: USER_AVATAR })
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
