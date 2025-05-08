import { Injectable } from '@nestjs/common';
import { Message } from '../../domain/entities/message.entity';
import { Conversation } from '../../domain/entities/conversation.entity';
@Injectable()
export class MessageBuilder {
  private message: Message = {
    identifier: crypto.randomUUID(),
    content: '',
    readBy: [],
    conversationIdentifier: '',
    author: '',
    date: new Date(),
  };

  new(message?: Message): MessageBuilder {
    if (message) {
      this.message = message;
    } else {
      this.message = {
        identifier: crypto.randomUUID(),
        content: '',
        readBy: [],
        conversationIdentifier: '',
        author: '',
        date: new Date(),
      };
    }
    return this;
  }

  setFrom(sender: string): MessageBuilder {
    this.message.author = sender;
    this.message.readBy.push(sender);
    return this;
  }

  setContent(content: string): MessageBuilder {
    this.message.content = content;
    return this;
  }

  setConversation(conversation: Conversation | string): MessageBuilder {
    if (typeof conversation === 'string') {
      this.message.conversationIdentifier = conversation;
    } else {
      this.message.conversationIdentifier = conversation.identifier;
    }
    return this;
  }

  addAttachement(attachment: {
    identifier: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }): MessageBuilder {
    if (!this.message.attachments) this.message.attachments = [];
    this.message.attachments.push(attachment);
    return this;
  }

  build(): Message {
    return this.message;
  }
}
