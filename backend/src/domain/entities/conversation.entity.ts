export interface Conversation {
  identifier: string;
  name: string;
  participants: string[];
  closed: boolean;
}

export interface ConversationUserViewed extends Conversation {
  unreadCount: number;
  lastMessage: string;
  lastMessageDate: Date;
}
