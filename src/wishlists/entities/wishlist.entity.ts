import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Length } from 'class-validator';
import { CommonInfo } from '../../utils';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends CommonInfo {
  @Column('varchar')
  @Length(1, 250)
  name: string;

  @Column()
  image: string;

  @Column('varchar')
  @Length(0, 1500)
  description: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
