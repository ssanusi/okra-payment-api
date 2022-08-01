import { Module } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function () {
            if (this.isModified('password')) {
              this.password = bcrypt.hashSync(this.password, 10);
            }
          });
          schema.pre('findOneAndUpdate', function () {
            if (this.getUpdate()['$set'].password) {
              this.getUpdate()['$set'].password = bcrypt.hashSync(
                this.getUpdate()['$set'].password,
                10,
              );
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
