import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonInfo } from '../../utils';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends CommonInfo {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column('numeric', {
    scale: 2,
  })
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}
