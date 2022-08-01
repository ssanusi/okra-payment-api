import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class WalletHistory extends Document {
  @Prop({ type: String, enum: ['DEBIT', 'CREDIT'] })
  action: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: new Date() })
  date: Date;
}

export const WalletHistorySchema = SchemaFactory.createForClass(WalletHistory);
