import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageBuilder } from './message.builder';
import { ConversationModule } from '../conversation/conversation.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/infrastructure/mongo/message.schema';
import { MessageInterceptor } from './message.interceptor';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';
import { MessageRepositoryProvider } from '../../domain/repositories/message.repository';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConversationModule,
    ChatModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageRepositoryProvider,
    MessageBuilder,
    MessageInterceptor,
  ],
  exports: [MessageService],
})
export class MessageModule {}
