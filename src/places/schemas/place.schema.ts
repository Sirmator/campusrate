import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const CATEGORIES = [
  'STUDY_SPACE',
  'LIBRARY',
  'FOOD_SERVICE',
  'SPORTS',
  'STUDENT_SERVICE',
  'COMPUTER_LAB',
  'OTHER',
];
const STATUSES = ['ACTIVE', 'TEMPORARILY_CLOSED', 'INACTIVE'];

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Place extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: CATEGORIES })
  category: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ required: true, enum: STATUSES, default: 'ACTIVE' })
  status: string;

  @Prop({ type: Number, default: null })
  averageRating: number | null;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
