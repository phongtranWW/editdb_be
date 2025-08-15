import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { RelationshipType } from '../types/relationship.type';
import { ColumnDataType } from '../types/column-data.type';

export type DiagramDocument = HydratedDocument<Diagram>;

@Schema({ timestamps: true })
export class Diagram {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        _id: false,
        id: { type: String, required: true },
        name: {
          type: String,
          required: true,
        },
        position: {
          x: { type: Number, default: 0 },
          y: { type: Number, default: 0 },
        },
        columns: [
          {
            _id: false,
            id: { type: String, required: true },
            name: { type: String, required: true },
            type: {
              type: String,
              enum: Object.values(ColumnDataType),
              required: true,
            },
            isPrimary: { type: Boolean, default: false },
            isUnique: { type: Boolean, default: false },
            isNullable: { type: Boolean, default: true },
            default: { type: String, required: false },
          },
        ],
      },
    ],
    default: [],
  })
  tables: {
    id: string;
    name: string;
    position: { x: number; y: number };
    columns: {
      id: string;
      name: string;
      type: ColumnDataType;
      isPrimary: boolean;
      isUnique: boolean;
      isNullable: boolean;
      default?: string;
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
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
    type: RelationshipType;
  }[];
}

export const DiagramSchema = SchemaFactory.createForClass(Diagram);
