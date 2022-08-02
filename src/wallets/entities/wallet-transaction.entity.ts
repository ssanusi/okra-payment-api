import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type WalletTransactionDocument = WalletTransaction & mongoose.Document;

@Schema({ timestamps: true })
export class WalletTransaction extends mongoose.Document {
  @Prop({ type: String, enum: ['DEBIT', 'CREDIT'], required: true })
  action: string;

  @Prop({
    type: String,
    enum: ['FUND-WALLET', 'PAYMENT', 'REFUND', 'REVERSE_DEBIT'],
    required: true,
  })
  type: string;

  @Prop()
  description: string;

  @Prop({ default: 0, required: true })
  amount: number;

  @Prop({ type: Number, required: true })
  balanceBeforeTransaction: number;

  @Prop({ type: Number, required: true })
  balanceAfterTransaction: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' })
  paymentId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true })
  walletId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: new Date() })
  date: Date;
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
