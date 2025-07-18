import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { ProfileDto } from './dtos/profile.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getProfile(id: string): Promise<ProfileDto> {
    const profile = await this.userModel
      .findById(id)
      .select('-roles -providers -__v');
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    try {
      return {
        id: profile._id.toString(),
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        isActive: profile.isActive,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const user = new this.userModel(dto);
      return await user.save();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneByProvider(provider: string, providerId: string) {
    try {
      return await this.userModel.findOne({ provider, providerId });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }
}
