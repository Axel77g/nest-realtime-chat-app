import { MongoConversationRepository } from 'src/infrastructure/mongo/conversation.repository';
import {
  Conversation,
  ConversationIdentifiable,
  ConversationPseudoOnly,
} from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';

export interface ConversationRepository {
  getParticipantConversations(
    participantPseudo: string,
  ): Promise<Conversation[]>;
  putConversation(
    conversation: ConversationPseudoOnly | Conversation,
  ): Promise<boolean>;
  getConversationByIdentifier(identifier: string): Promise<Conversation | null>;
  countUnreadMessages(
    conversation: ConversationIdentifiable,
    participantPseudo: string,
  ): Promise<number>;
  getLastMessage(
    conversation: ConversationIdentifiable,
  ): Promise<Message | null>;
  getConversationByParticipants(
    participants: string[],
  ): Promise<Conversation | null>;
  markAsRead(
    conversation: ConversationIdentifiable,
    participantPseudo: string,
  ): Promise<boolean>;
}

// make the interface injectable
export const ConversationRepositoryProvider = {
  provide: 'ConversationRepository',
  useClass: MongoConversationRepository,
};
