import { MongoMessageRepository } from 'src/infrastructure/mongo/message.repository';
import { Message } from '../entities/message.entity';

export interface MessageRepository {
  getMessageByIdentifier(identifier: string): Promise<Message | null>;
  putMessage(message: Message): Promise<boolean>;
  deleteMessage(identifier: string): Promise<boolean>;
  getMessagesByConversationIdentifier(
    conversationIdentifier: string,
    startAtIdentifier?: string,
  ): Promise<Message[]>;
}

export const MessageRepositoryProvider = {
  provide: 'MessageRepository',
  useClass: MongoMessageRepository,
};
