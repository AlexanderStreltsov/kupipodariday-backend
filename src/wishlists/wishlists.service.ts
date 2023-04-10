import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishesService } from '../wishes/wishes.service';
import { type TWishlistWithOwnerNoEmailAndPass } from '../types';
import {
  WISHLISTS_NOT_FOUND_MSG,
  WISHLIST_CANT_EDIT_MSG,
  WISHLIST_DELETE_MSG,
} from '../constants/error-messages';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  /**
   * common CRUD methods
   */

  async create(
    owner: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<TWishlistWithOwnerNoEmailAndPass> {
    delete owner.password;
    delete owner.email;

    if (!createWishlistDto.description) {
      createWishlistDto.description = '';
    }

    const wishes = await this.wishesService.findMany({});
    const { itemsId } = createWishlistDto;

    const items = itemsId
      .map((item) => wishes.find((wish) => wish.id === item))
      .filter((item) => item !== undefined);

    const newWishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner,
      items,
    });

    return this.wishlistsRepository.save(newWishlist);
  }

  async findOne(query: FindOneOptions<Wishlist>) {
    const wishlist = await this.wishlistsRepository.findOne(query);
    return wishlist;
  }

  async findMany(query: FindManyOptions<Wishlist>) {
    const wishlists = await this.wishlistsRepository.find(query);
    return wishlists;
  }

  async updateOne(id: number, updateWishlistDto: UpdateWishlistDto) {
    await this.wishlistsRepository.update({ id }, updateWishlistDto);
    return this.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async removeOne(id: number) {
    return this.wishlistsRepository.delete({ id });
  }

  /**
   * API methods
   */
  async getWishlists(): Promise<TWishlistWithOwnerNoEmailAndPass[]> {
    const wishlists = await this.findMany({
      relations: {
        owner: true,
        items: true,
      },
    });

    const updatedWishlists: TWishlistWithOwnerNoEmailAndPass[] = wishlists.map(
      (wishlist) => {
        delete wishlist.owner.password;
        delete wishlist.owner.email;
        return wishlist;
      },
    );

    return updatedWishlists;
  }

  async getWishlist(id: number): Promise<TWishlistWithOwnerNoEmailAndPass> {
    if (Number.isNaN(id)) {
      throw new NotFoundException(WISHLISTS_NOT_FOUND_MSG);
    }

    const wishlist = await this.findOne({
      where: [{ id }],
      relations: {
        items: { offers: true },
        owner: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException(WISHLISTS_NOT_FOUND_MSG);
    }

    wishlist.items.forEach((item) => this.wishesService.getWishRaised(item));

    delete wishlist.owner.password;
    delete wishlist.owner.email;

    return wishlist;
  }

  async updateWishlist(
    updateWishlistDto: UpdateWishlistDto,
    id: number,
    userId: number,
  ): Promise<TWishlistWithOwnerNoEmailAndPass> {
    if (Number.isNaN(id)) {
      throw new NotFoundException(WISHLISTS_NOT_FOUND_MSG);
    }

    const wishlist = await this.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException(WISHLISTS_NOT_FOUND_MSG);
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(WISHLIST_CANT_EDIT_MSG);
    }

    const updatedWishlist = await this.updateOne(id, updateWishlistDto);

    delete updatedWishlist.owner.password;
    delete updatedWishlist.owner.email;

    return updatedWishlist;
  }

  async deleteWishlist(
    id: number,
    userId: number,
  ): Promise<TWishlistWithOwnerNoEmailAndPass> {
    if (Number.isNaN(id)) {
      throw new NotFoundException(WISHLISTS_NOT_FOUND_MSG);
    }

    const wishlist = await this.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException(WISHLISTS_NOT_FOUND_MSG);
    }

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException(WISHLIST_DELETE_MSG);
    }

    await this.removeOne(id);

    delete wishlist.owner.password;
    delete wishlist.owner.email;

    return wishlist;
  }
}
