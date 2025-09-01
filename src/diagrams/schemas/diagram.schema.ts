import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { RelationshipType } from '../types/relationship.type';
import { DatabaseType } from '../types/database.type';

export type DiagramDocument = HydratedDocument<Diagram>;

@Schema({ timestamps: true })
export class Diagram {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        _id: false,
        id: { type: String, required: true },
        name: {
          type: String,
          required: true,
        },
        columns: [
          {
            _id: false,
            id: { type: String, required: true },
            name: { type: String, required: true },
            type: {
              type: String,
              required: true,
            },
            isPrimary: { type: Boolean, default: false },
            isUnique: { type: Boolean, default: false },
            isNullable: { type: Boolean, default: true },
          },
        ],
      },
    ],
    default: [],
  })
  tables: {
    id: string;
    name: string;
    columns: {
      id: string;
      name: string;
      type: string;
      isPrimary: boolean;
      isUnique: boolean;
      isNullable: boolean;
    }[];
  }[];

  @Prop({
    type: [
      {
        _id: false,
        id: { type: String, required: true },
        name: { type: String, required: true },
        fromTable: { type: String },
        fromColumn: { type: String },
        toTable: { type: String },
        toColumn: { type: String },
        type: {
          type: String,
          enum: Object.values(RelationshipType),
        },
      },
    ],
    default: [],
  })
  relationships: {
    id: string;
    name: string;
    fromTable?: string;
    fromColumn?: string;
    toTable?: string;
    toColumn?: string;
    type?: RelationshipType;
  }[];

  @Prop({ type: String, enum: Object.values(DatabaseType), required: true })
  type: DatabaseType;

  createdAt: Date;
  updatedAt: Date;
}

export const DiagramSchema = SchemaFactory.createForClass(Diagram);
