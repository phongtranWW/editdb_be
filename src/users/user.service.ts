import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto) {
    const user = new this.userModel(dto);
    return await user.save();
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findOneByProvider(provider: string, providerId: string) {
    return await this.userModel.findOne({ provider, providerId });
  }
}
