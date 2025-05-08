import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ConversationInterceptor } from 'src/modules/conversation/conversation.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { MessageInterceptor } from './message.interceptor';
import { ChatEvent, ChatGateway } from '../chat/Chat.gateway';
import { Conversation } from '../../domain/entities/conversation.entity';
import { User } from '../../domain/entities/user.entity';
import { Message } from '../../domain/entities/message.entity';

@Controller('conversations/:conversationIdentifier/messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(ConversationInterceptor)
  async index(
    @Req() request: { conversation: Conversation; user: User },
    @Query('from') messageIdentifier: string,
  ) {
    const messages = await this.messageService.readMessageFromConversation(
      request.conversation,
      request.user,
      messageIdentifier,
    );
    if (messages instanceof Error) throw messages;
    this.chatGateway.broadcastUpdateToConversation(
      request.conversation,
      request.user,
      ChatEvent.READ_UPDATE,
    );
    return messages;
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(ConversationInterceptor)
  async sendMessage(
    @Req() request: { conversation: Conversation; user: User },
    @Body() body: { content: string; attachements?: any[] },
  ) {
    const message = await this.messageService.sendMessage(
      request.conversation,
      request.user,
      body.content,
      body.attachements,
    );
    if (message instanceof Error) return message;
    this.chatGateway.broadcastUpdateToConversation(
      request.conversation,
      request.user,
      ChatEvent.NEW_UPDATE_MESSAGE,
      {
        message: message.content,
        date: new Date(),
      },
    );
    return message;
  }

  @Delete(':identifier')
  @UseGuards(AuthGuard)
  @UseInterceptors(ConversationInterceptor)
  @UseInterceptors(MessageInterceptor)
  async deleteMessage(
    @Req()
    request: {
      conversation: Conversation;
      user: User;
      message: Message;
    },
  ) {
    const response = await this.messageService.deleteMessage(request.message);
    if (!response) return new Error('Error while deleting message');
    this.chatGateway.broadcastUpdateToConversation(
      request.conversation,
      request.user,
      ChatEvent.NEW_UPDATE_MESSAGE,
      {
        message: 'Message deleted',
        date: new Date(),
      },
    );
    return response;
  }
}
