import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';
import {
  OFFERS_NOT_FOUND,
  OFFERS_SUM_MSG,
  OFFERS_CANT_EDIT_MSG,
} from '../constants/error-messages';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  /**
   * common CRUD methods
   */
  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne({
      where: { id: createOfferDto.itemId },
      relations: {
        offers: true,
        owner: true,
      },
    });

    const wishWithRaised = this.wishesService.getWishRaised(wish);
    const { raised, price } = wishWithRaised;

    if (raised > price || raised + createOfferDto.amount > price) {
      throw new ForbiddenException(OFFERS_SUM_MSG);
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(OFFERS_CANT_EDIT_MSG);
    }

    const newOffer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wishWithRaised,
    });

    if (newOffer.hidden === false) {
      delete newOffer.user;
    } else {
      delete newOffer.user.password;
      delete newOffer.user.email;
    }

    return this.offersRepository.save(newOffer);
  }

  async findMany(query: FindManyOptions<Offer>) {
    const offers = await this.offersRepository.find(query);
    return offers;
  }

  async findOne(query: FindOneOptions<Offer>) {
    const offer = await this.offersRepository.findOne(query);
    return offer;
  }

  /**
   * API methods
   */
  async getOffers() {
    const offersArr = await this.findMany({
      relations: {
        item: { offers: true, owner: true },
        user: {
          offers: { item: true },
          wishes: { offers: true, owner: true },
          wishlists: true,
        },
      },
    });

    const updatedOffers = offersArr.map((offer) => {
      delete offer.item.owner.password;
      delete offer.item.owner.email;
      return offer;
    });

    return updatedOffers;
  }

  async getOffer(id: number) {
    if (Number.isNaN(id)) {
      throw new NotFoundException(OFFERS_NOT_FOUND);
    }

    const offer = await this.findOne({
      where: [{ id }],
      relations: {
        item: { offers: true, owner: true },
        user: { offers: true, wishes: true, wishlists: true },
      },
    });

    if (!offer) {
      throw new NotFoundException(OFFERS_NOT_FOUND);
    }

    delete offer.item.owner.password;
    delete offer.item.owner.email;

    return offer;
  }
}
