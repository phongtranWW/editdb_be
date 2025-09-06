import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../types/role';
import { Provider } from '../types/provider';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ type: String, enum: Object.values(Role), default: Role.USER })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    default: [],
    type: [
      {
        provider: {
          type: String,
          enum: Object.values(Provider),
          required: true,
        },
        providerId: {
          type: String,
          required: false,
        },
        hash: { type: String, required: false },
      },
    ],
  })
  providers: {
    provider: Provider;
    providerId?: string;
    hash?: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
