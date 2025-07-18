import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google.guard';
import { AuthService } from './auth.service';
import { JwtPayload } from './strategies/types/jwt-payload.type';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

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
  loginGoogleRedirect(@Req() req: Request) {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.authService.provideToken(user);
  }
}
