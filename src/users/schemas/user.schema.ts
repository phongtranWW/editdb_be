import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  avatar: string;

  @Prop({ default: ['user'] })
  roles: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    default: [],
    type: [
      {
        provider: {
          type: String,
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
        hash: { type: String, required: false },
      },
    ],
  })
  providers: {
    provider: string;
    providerId: string;
    hash?: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
