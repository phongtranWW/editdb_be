import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { JwtPayload } from './strategies/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(payload: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
    avatar?: string;
  }): Promise<JwtPayload> {
    let userByEmail = await this.userService.findOneByEmail(payload.email);

    if (!userByEmail) {
      // Create new user
      userByEmail = await this.userService.create({
        email: payload.email,
        name: payload.name,
        avatar: payload.avatar,
        providers: [
          {
            provider: payload.provider,
            providerId: payload.providerId,
          },
        ],
      });
    } else {
      // Check if user is already registered
      if (
        !userByEmail.providers.find(
          (provider) =>
            provider.provider === payload.provider &&
            provider.providerId === payload.provider,
        )
      ) {
        userByEmail.providers.push({
          provider: payload.provider,
          providerId: payload.providerId,
        });
        await userByEmail.save();
      }
    }

    return {
      sub: userByEmail._id.toString(),
      email: userByEmail.email,
      roles: userByEmail.roles,
    };
  }

  provideToken(payload: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
