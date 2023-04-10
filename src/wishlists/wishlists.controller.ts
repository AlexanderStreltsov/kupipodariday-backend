import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { type IUserRequest } from '../types';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  getWishlists() {
    return this.wishlistsService.getWishlists();
  }

  @UseGuards(JwtGuard)
  @Post()
  async createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: IUserRequest,
  ) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishlist(@Param('id') id: number) {
    return this.wishlistsService.getWishlist(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlist(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: number,
    @Req() req: IUserRequest,
  ) {
    return this.wishlistsService.updateWishlist(
      updateWishlistDto,
      id,
      req.user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishlist(@Param('id') id: number, @Req() req: IUserRequest) {
    return this.wishlistsService.deleteWishlist(id, req.user.id);
  }
}
