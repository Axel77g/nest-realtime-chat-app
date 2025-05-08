export interface MessageAttachment {
  identifier: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Message {
  identifier: string;
  author: string;
  readBy: string[];
  content: string;
  date: Date;
  conversationIdentifier: string;
  attachments?: MessageAttachment[];
}

export interface MessageUserViewed extends Message {
  read: boolean;
}
