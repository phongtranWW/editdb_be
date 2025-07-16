import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google.guard';
import { AuthService } from './auth.service';
import { JwtPayload } from './strategies/types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  loginGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  loginGoogleRedirect(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.provideToken(req.user as JwtPayload);
  }
}
