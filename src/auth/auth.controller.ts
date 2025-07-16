import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  loginGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  loginGoogleRedirect(@Request() req) {}
}
