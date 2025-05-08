import { MongoConversationRepository } from 'src/infrastructure/mongo/conversation.repository';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';

export interface ConversationRepository {
  getParticipantConversations(
    participantPseudo: string,
  ): Promise<Conversation[]>;
  putConversation(conversation: Conversation): Promise<boolean>;
  getConversationByIdentifier(identifier: string): Promise<Conversation | null>;
  countUnreadMessages(
    conversation: Conversation,
    participantPseudo: string,
  ): Promise<number>;
  getLastMessage(conversation: Conversation): Promise<Message | null>;

  markAsRead(
    conversation: Conversation,
    participantPseudo: string,
  ): Promise<boolean>;
}

// make the interface injectable
export const ConversationRepositoryProvider = {
  provide: 'ConversationRepository',
  useClass: MongoConversationRepository,
};
