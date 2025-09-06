import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ProfileDto } from './dtos/profile.dto';
import { ProviderInternal } from './internals/provider.payload';
import { CreateUserInternal } from './internals/create-user.internal';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getProfile(id: string): Promise<ProfileDto> {
    const profile = await this.userModel
      .findById(id)
      .select('-role -providers -__v');
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return {
      id: profile._id.toString(),
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      isActive: profile.isActive,
    };
  }

  async create(internal: CreateUserInternal) {
    const user = new this.userModel(internal);
    return await user.save();
  }

  async addProvider(id: string, internal: ProviderInternal) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $push: { providers: internal } },
      { new: true },
    );
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
