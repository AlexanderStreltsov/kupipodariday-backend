import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UNAUTORIZED_MSG } from '../../constants/error-messages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('secret'),
      ignoreExpiration: false,
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findOneById(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException(UNAUTORIZED_MSG);
    }

    return user;
  }
}
