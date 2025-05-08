import { Inject, Injectable } from '@nestjs/common';

import { MessageBuilder } from './message.builder';
import { ConversationService } from '../conversation/conversation.service';
import { Message } from '../../domain/entities/message.entity';
import { Conversation } from '../../domain/entities/conversation.entity';
import { User } from '../../domain/entities/user.entity';
import {
  MessageRepository,
  MessageRepositoryProvider,
} from '../../domain/repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MessageRepositoryProvider.provide)
    private messageRepository: MessageRepository,
    private messageBuilder: MessageBuilder,
    private conversationService: ConversationService,
  ) {}

  async getMessageByIdentifier(identifier: string): Promise<Message | Error> {
    const message =
      await this.messageRepository.getMessageByIdentifier(identifier);
    if (!message) return new Error('Message not found');
    return message;
  }

  async isAuthor(message: Message, pseudo: string): Promise<boolean> {
    if (message.author !== pseudo) return false;
    return true;
  }

  async sendMessage(
    conversation: Conversation,
    sender: User,
    content: string,
    attachements?: any[],
  ): Promise<Message | Error> {
    const message = this.messageBuilder
      .new()
      .setFrom(sender.pseudo)
      .setContent(content)
      .setConversation(conversation);

    if (attachements) {
      for (const attachement of attachements) {
        message.addAttachement(attachement);
      }
    }

    const messageToSend = message.build();
    const response = await this.messageRepository.putMessage(messageToSend);
    if (!response) return new Error('Error while sending message');
    return messageToSend;
  }

  async deleteMessage(message: Message): Promise<boolean> {
    return this.messageRepository.deleteMessage(message.identifier);
  }

  /**
   * Get the X last message and mark the conversation as read
   * @param conversation
   * @param user
   */
  async readMessageFromConversation(
    conversation: Conversation,
    user: User,
    messageIdentifier?: string,
  ): Promise<Message[] | Error> {
    const messages =
      await this.messageRepository.getMessagesByConversationIdentifier(
        conversation.identifier,
        messageIdentifier,
      );
    if (!messages) return new Error('Error while loading messages');
    const result = await this.conversationService.markAsRead(
      conversation,
      user,
    );
    if (result instanceof Error) return result;
    return messages;
  }
}
