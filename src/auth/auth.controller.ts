import {
  Controller,
  Get,
  NotFoundException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google.guard';
import { AuthService } from './auth.service';
import { JwtPayload } from './strategies/types/jwt-payload.type';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth2',
  })
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  loginGoogle() {}

  @Get('google/callback')
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with access token',
  })
  @UseGuards(GoogleOAuthGuard)
  loginGoogleRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    const { accessToken } = this.authService.provideToken(user);
    const frontendRedirectUrl: string = this.configService.getOrThrow(
      'FRONTEND_REDIRECT_URL',
    );

    return res.redirect(`${frontendRedirectUrl}?token=${accessToken}`);
  }
}
