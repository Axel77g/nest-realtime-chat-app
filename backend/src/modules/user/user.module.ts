import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/infrastructure/mongo/user.schema';
import { UserRepositoryProvider } from '../../domain/repositories/user.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserService, UserRepositoryProvider],
  exports: [UserService],
})
export class UserModule {}
