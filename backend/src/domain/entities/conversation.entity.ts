import { User } from './user.entity';

export interface ConversationIdentifiable {
  identifier: string;
}

export interface Conversation extends ConversationIdentifiable {
  name: string;
  participants: User[];
  closed: boolean;
}

export interface ConversationPseudoOnly extends ConversationIdentifiable {
  name: string;
  participants: string[];
  closed: boolean;
}

export interface ConversationUserViewed extends Conversation {
  unreadCount: number;
  lastMessage: string;
  lastMessageDate: Date;
}
