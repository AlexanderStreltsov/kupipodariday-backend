import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { CommonInfo } from '../../utils';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wish extends CommonInfo {
  @Column('varchar')
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column('numeric', {
    scale: 2,
  })
  price: number;

  @Column({
    scale: 2,
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column('varchar')
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    scale: 0,
    default: 0,
  })
  copied: number;
}
