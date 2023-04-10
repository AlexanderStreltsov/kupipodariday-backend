import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { HashService } from '../hash/hash.service';
import { WishesService } from '../wishes/wishes.service';
import {
  USER_EXIST_MSG,
  USER_NOT_FOUND_MSG,
} from '../constants/error-messages';
import { type TUserWithoutPass, type TUserWithoutEmailAndPass } from '../types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashServise: HashService,
    private wishesService: WishesService,
  ) {}

  /**
   * common CRUD methods
   */
  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findOne(query: FindOneOptions<User>) {
    const user = await this.usersRepository.findOne(query);
    return user;
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    return user;
  }

  async findMany(query: FindManyOptions<User>) {
    const users = await this.usersRepository.find(query);
    return users;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update({ id }, updateUserDto);
    return this.findOneById(id);
  }

  /**
   * API methods
   */
  async createUser(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;
    const existUser = await this.findOne({
      where: [{ email }, { username }],
    });

    if (existUser) {
      throw new ConflictException(USER_EXIST_MSG);
    }

    const hash = await this.hashServise.createHash(createUserDto.password);
    const newUser = await this.create({
      ...createUserDto,
      password: hash,
    });

    return newUser;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<TUserWithoutPass> {
    const { password } = updateUserDto;

    if (password) {
      const newPassword = await this.hashServise.createHash(password);
      updateUserDto.password = newPassword;
    }

    const updatedUser = await this.updateOne(id, updateUserDto);
    delete updatedUser.password;

    return updatedUser;
  }

  async getWishes(id: number) {
    const user = await this.findOne({
      where: { id },
      relations: {
        wishes: {
          owner: true,
          offers: {
            item: { owner: true, offers: true },
            user: { wishes: true, offers: true, wishlists: true },
          },
        },
      },
    });

    const wishes = user.wishes.map((wish) => {
      return this.wishesService.getWishRaised(wish);
    });

    return wishes;
  }

  async getUserByName(username: string): Promise<TUserWithoutEmailAndPass> {
    const user = await this.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_MSG);
    }

    delete user.password;
    delete user.email;

    return user;
  }

  async findUsersByEmailOrName(
    findUsersDto: FindUsersDto,
  ): Promise<TUserWithoutPass[]> {
    const { query } = findUsersDto;

    const users = await this.findMany({
      where: [{ email: query }, { username: query }],
    });

    const result: TUserWithoutPass[] = users.map((user) => {
      if (user.password) {
        delete user.password;
      }
      return user;
    });

    return result;
  }
}
