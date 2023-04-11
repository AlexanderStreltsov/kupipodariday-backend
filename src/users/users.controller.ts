import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { type IUserRequest, type TUserWithoutPass } from '../types';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@Req() req: IUserRequest): TUserWithoutPass {
    const { user } = req;
    delete user.password;
    return user;
  }

  @Patch('me')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: IUserRequest,
  ) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getWishes(@Req() req: IUserRequest) {
    return this.usersService.getWishes(req.user.id);
  }

  @Get(':username')
  async getUserByName(@Param('username') username: string) {
    return this.usersService.getUserByName(username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const user = await this.usersService.getUserByName(username);
    return this.usersService.getWishes(user.id);
  }

  @Post('find')
  async findUsersByEmailOrName(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findUsersByEmailOrName(findUsersDto);
  }
}
