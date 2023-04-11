import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { type IUserRequest } from '../types';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: IUserRequest) {
    return this.offersService.create(req.user, createOfferDto);
  }

  @Get()
  getOffers() {
    return this.offersService.getOffers();
  }

  @Get(':id')
  async getOffer(@Param('id') id: number) {
    return this.offersService.getOffer(id);
  }
}
