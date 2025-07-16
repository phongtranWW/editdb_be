import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google.guard';
import { AuthService } from './auth.service';
import { JwtPayload } from './strategies/types/jwt-payload.type';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth2',
  })
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  loginGoogle() {}

  @Get('google/callback')
  @ApiResponse({
    status: 200,
    description: 'The access token',
  })
  @UseGuards(GoogleOAuthGuard)
  loginGoogleRedirect(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.provideToken(req.user as JwtPayload);
  }
}
