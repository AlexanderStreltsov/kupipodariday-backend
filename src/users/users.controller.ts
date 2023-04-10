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
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import {
  type IUserRequest,
  type TUserWithoutPass,
  type TUserWithoutEmailAndPass,
} from '../types';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@Req() req: IUserRequest): TUserWithoutPass {
    delete req.user.password;
    return req.user;
  }

  @Get(':username')
  async getUserByName(
    @Param('username') username: string,
  ): Promise<TUserWithoutEmailAndPass> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException();
    }

    delete user.password;
    delete user.email;

    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
