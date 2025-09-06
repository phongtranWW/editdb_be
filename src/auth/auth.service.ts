import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { ValidateOAthInternal } from './internals/validate-oauth.internal';
import { RegisterDto } from './dtos/register.dto';
import { Provider } from 'src/users/types/provider';
import { compare, hash } from 'bcrypt';
import { JwtInternal } from './internals/jwt.internal';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(
    internal: ValidateOAthInternal,
  ): Promise<JwtInternal> {
    let user = await this.userService.findOneByEmail(internal.email);

    if (!user) {
      user = await this.userService.create({
        email: internal.email,
        name: internal.name,
        avatar: internal.avatar,
        providers: [
          {
            provider: internal.provider,
            providerId: internal.providerId,
          },
        ],
      });
    } else {
      const hasProvider = user.providers.some(
        (p) =>
          p.provider === internal.provider &&
          p.providerId === internal.providerId,
      );

      if (!hasProvider) {
        user = await this.userService.addProvider(user._id.toString(), {
          provider: internal.provider,
          providerId: internal.providerId,
        });
      }
    }

    return {
      sub: user!._id.toString(),
      email: user!.email,
      role: user!.role,
      name: user!.name,
      avatar: user!.avatar,
    };
  }

  async validateLogin(email: string, password: string): Promise<JwtInternal> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const provider = user.providers.find(
      (p) => p.provider === Provider.PASSWORD,
    );
    if (!provider || !provider.hash) {
      throw new BadRequestException('User is not registered with password');
    }
    const validPassword = await compare(password, provider.hash);
    if (!validPassword) {
      throw new BadRequestException('Invalid email or password');
    }
    return {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    };
  }

  async register(dto: RegisterDto) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (user) {
      throw new ConflictException('Email already exists');
    }
    const hashPassword: string = await hash(dto.password, 10);

    await this.userService.create({
      email: dto.email,
      name: dto.name,
      providers: [
        {
          provider: Provider.PASSWORD,
          hash: hashPassword,
        },
      ],
    });
  }

  provideToken(internal: JwtInternal) {
    return {
      accessToken: this.jwtService.sign(internal),
    };
  }
}
