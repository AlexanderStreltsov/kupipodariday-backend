import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { type TWishWithOwnerNoEmailAndPass } from '../types';
import {
  WISH_NOT_FOUND_MSG,
  WISH_NOT_MY_MSG,
  WISH_CANT_EDIT_MSG,
  WISH_DELETE_MSG,
} from '../constants/error-messages';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  /**
   * common CRUD methods
   */
  async create(
    owner: User,
    createWishDto: CreateWishDto,
  ): Promise<TWishWithOwnerNoEmailAndPass> {
    delete owner.password;
    delete owner.email;

    const newWish = this.wishesRepository.create({
      ...createWishDto,
      owner,
    });

    return this.wishesRepository.save(newWish);
  }

  async findOne(query: FindOneOptions<Wish>) {
    const wish = await this.wishesRepository.findOne(query);
    return wish;
  }

  async findMany(query: FindManyOptions<Wish>) {
    const wishes = await this.wishesRepository.find(query);
    return wishes;
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto) {
    await this.wishesRepository.update({ id }, updateWishDto);
    return this.findOne({ where: [{ id }] });
  }

  async removeOne(id: number) {
    return this.wishesRepository.delete({ id });
  }

  /**
   * common methods
   */
  getWishRaised = (wish: Wish): TWishWithOwnerNoEmailAndPass => {
    const { offers } = wish;
    const newRaised = offers
      .map((offer) => offer.amount)
      .reduce((acc, value) => acc + value, 0);

    wish.raised = newRaised;

    if (wish.owner?.password) {
      delete wish.owner.password;
    }

    if (wish.owner?.email) {
      delete wish.owner.email;
    }

    return wish;
  };

  /**
   * API methods
   */
  async getLast(): Promise<TWishWithOwnerNoEmailAndPass[]> {
    const wishes = await this.findMany({
      relations: {
        owner: true,
        offers: {
          item: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    const wishesWithRaised = wishes.map((wish) => this.getWishRaised(wish));

    return wishesWithRaised;
  }

  async getTop() {
    const wishes = await this.findMany({
      relations: {
        owner: true,
        offers: {
          item: true,
        },
      },
      order: {
        copied: 'DESC',
      },
      take: 10,
    });

    const wishesWithRaised = wishes.map((wish) => this.getWishRaised(wish));

    return wishesWithRaised;
  }

  async getWish(id: number): Promise<TWishWithOwnerNoEmailAndPass> {
    if (Number.isNaN(id)) {
      throw new NotFoundException(WISH_NOT_FOUND_MSG);
    }

    const wish = await this.findOne({
      where: [{ id }],
      relations: {
        owner: true,
        offers: {
          item: true,
          user: { offers: true, wishes: true, wishlists: true },
        },
      },
    });

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND_MSG);
    }

    const wishWithRaised = this.getWishRaised(wish);

    return wishWithRaised;
  }

  async updateWish(updateWishDto: UpdateWishDto, id: number, userId: number) {
    if (Number.isNaN(id)) {
      throw new NotFoundException(WISH_NOT_FOUND_MSG);
    }

    const wish = await this.findOne({
      where: [{ id }],
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND_MSG);
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException(WISH_NOT_MY_MSG);
    }

    if (wish.offers.length !== 0 && wish.raised !== 0) {
      throw new ForbiddenException(WISH_CANT_EDIT_MSG);
    }

    await this.updateOne(id, updateWishDto);

    return;
  }

  async deleteWish(
    id: number,
    userId: number,
  ): Promise<TWishWithOwnerNoEmailAndPass> {
    if (Number.isNaN(id)) {
      throw new NotFoundException(WISH_NOT_FOUND_MSG);
    }

    const wish = await this.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          item: true,
          user: { offers: true, wishes: true, wishlists: true },
        },
      },
    });

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND_MSG);
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException(WISH_DELETE_MSG);
    }

    await this.removeOne(id);

    delete wish.owner.password;
    delete wish.owner.email;

    return wish;
  }

  async copyWish(owner: User, id: number) {
    if (Number.isNaN(id)) {
      throw new NotFoundException(WISH_NOT_FOUND_MSG);
    }

    const wish = await this.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND_MSG);
    }

    const { name, link, image, price, description } = wish;
    const copiedWish = await this.create(owner, {
      name,
      link,
      image,
      price,
      description,
    });

    const updatedWish = {
      ...wish,
      copied: wish.copied + 1,
    };

    await this.updateOne(updatedWish.id, updatedWish);

    return copiedWish;
  }
}
