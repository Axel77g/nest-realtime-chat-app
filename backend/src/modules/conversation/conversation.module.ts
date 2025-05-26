import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationSchema } from 'src/infrastructure/mongo/conversation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationService } from './conversation.service';
import { UserModule } from '../user/user.module';
import { ConversationInterceptor } from './conversation.interceptor';
import { AuthModule } from '../auth/auth.module';
import { MessageSchema } from '../../infrastructure/mongo/message.schema';
import { ConversationRepositoryProvider } from '../../domain/repositories/conversation.repository';
import { UserSchema } from '../../infrastructure/mongo/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Conversation', schema: ConversationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserModule,
    AuthModule,
  ],
  controllers: [ConversationController],
  providers: [
    ConversationInterceptor,
    ConversationService,
    ConversationRepositoryProvider,
  ],
  exports: [ConversationService, ConversationInterceptor],
})
export class ConversationModule {}
