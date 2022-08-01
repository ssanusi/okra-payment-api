import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { WalletHistory } from './history.entity';

@Schema({ timestamps: true })
export class Wallet extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  owner: User;

  @Prop({ default: 0 })
  balance: number;

  @Prop([{ type: WalletHistory, default: [] }])
  history: WalletHistory[];

  @Prop({ type: String, enum: ['NGN', 'USD'] })
  currency: string;

  @Prop()
  dailyLimit: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
