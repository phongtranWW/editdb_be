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
    firstName: string;
    lastName: string;
    picture: string;
    provider: string;
    providerId: string;
  }): Promise<JwtPayload> {
    let userByEmail = await this.userService.findOneByEmail(payload.email);

    if (!userByEmail) {
      // Create new user
      userByEmail = await this.userService.create({
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        avatar: payload.picture,
        provider: [
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

  login(user: JwtPayload) {
    const payload = { sub: user.sub, email: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
