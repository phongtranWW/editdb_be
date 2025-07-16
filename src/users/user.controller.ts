import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = req.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.userService.getProfile(user.sub);
  }
}
