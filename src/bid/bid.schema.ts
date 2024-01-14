// bid/bid.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/user.schema';

@Schema()
export class Bid extends Document {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  start_time: Date;

  @Prop({ required: true })
  close_time: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
