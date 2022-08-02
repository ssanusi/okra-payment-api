import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type RefundDocument = Refund & mongoose.Document;

@Schema({ timestamps: true })
export class Refund extends mongoose.Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Payment' })
  paymentId: mongoose.Types.ObjectId;

  @Prop()
  amount: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Wallet' })
  walletDebited: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Wallet' })
  walletCredited: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: ['PARTIAL', 'FULL'],
  })
  type: string;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);
