import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Wallet } from 'src/wallets/entities/wallet.entity';

export type userDocument = User & mongoose.Document;
@Schema({ timestamps: true })
export class User extends mongoose.Document {
  @Prop({ trim: true, lowercase: true, required: true })
  firstName: string;

  @Prop({ trim: true, lowercase: true, required: true })
  lastName: string;

  @Prop({ unique: true, trim: true, lowercase: true, required: true })
  email: string;

  @Prop()
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', default: [] }])
  wallets: Wallet[];
}

export const UserSchema = SchemaFactory.createForClass(User);
