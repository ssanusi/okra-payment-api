import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type WalletDocument = Wallet & mongoose.Document;
@Schema({ timestamps: true })
export class Wallet extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ type: String, enum: ['NGN', 'USD'], required: true })
  currency: string;

  @Prop()
  dailyLimit: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
