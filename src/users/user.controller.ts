import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dtos/profile.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/strategies/types/jwt-payload.type';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'User profile returned',
    type: ProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('me')
  @UseGuards(JwtGuard)
  async getProfile(@Req() req: Request) {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.userService.getProfile(user.sub);
  }
}
