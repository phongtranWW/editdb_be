import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtInternal } from './internals/jwt.internal';

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
    const { accessToken } = this.authService.provideToken(
      req.user as JwtInternal,
    );
    const frontendRedirectUrl: string = this.configService.getOrThrow(
      'FRONTEND_REDIRECT_URL',
    );

    return res.redirect(`${frontendRedirectUrl}?token=${accessToken}`);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.provideToken(req.user as JwtInternal);
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);
  }
}
