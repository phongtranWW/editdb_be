import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { Provider } from 'src/users/types/provider';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    if (!profile.emails?.[0].value) {
      return done(null, false, { message: 'Email not found' });
    }

    if (!profile.displayName) {
      return done(null, false, { message: 'Name not found' });
    }

    const user = await this.authService.validateOAuthLogin({
      email: profile.emails?.[0].value,
      name: profile.displayName,
      provider: Provider.GOOGLE,
      providerId: profile.id,
      avatar: profile.photos?.[0].value,
    });

    return done(null, user);
  }
}
