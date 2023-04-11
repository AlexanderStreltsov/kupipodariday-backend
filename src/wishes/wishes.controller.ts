import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { type IUserRequest } from '../types';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async create(@Req() req: IUserRequest, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user, createWishDto);
  }

  @Get('last')
  async getLast() {
    return this.wishesService.getLast();
  }

  @Get('top')
  async getTopWishes() {
    return this.wishesService.getTop();
  }

  @Get(':id')
  async getWish(@Param('id') id: number) {
    return this.wishesService.getWish(id);
  }

  @Patch(':id')
  async updateWish(
    @Body() updateWishDto: UpdateWishDto,
    @Param('id') id: number,
    @Req() req: IUserRequest,
  ) {
    return this.wishesService.updateWish(updateWishDto, id, req.user.id);
  }

  @Delete(':id')
  async deleteWish(@Param('id') id: number, @Req() req: IUserRequest) {
    return this.wishesService.deleteWish(id, req.user.id);
  }

  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Req() req: IUserRequest) {
    return this.wishesService.copyWish(req.user, id);
  }
}
