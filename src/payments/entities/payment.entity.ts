import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type PaymentDocument = Payment & mongoose.Document;

@Schema({ timestamps: true })
export class Payment extends mongoose.Document {
  @Prop()
  amount: number;

  @Prop({ type: String, enum: ['NGN', 'USD'] })
  currency: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creditWallet: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  debitWallet: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: mongoose.Schema.Types.ObjectId;

  @Prop()
  ref: string;

  @Prop()
  reason: string;

  @Prop({ type: Boolean, default: false })
  isFullyRefunded: boolean;

  @Prop()
  refundableAmount: number;

  @Prop({
    type: String,
    enum: ['INITIATED', 'SUCCESS', 'FAILED'],
    default: 'INITIATED',
  })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
