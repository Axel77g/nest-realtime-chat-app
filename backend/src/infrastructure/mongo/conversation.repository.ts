import { Model } from 'mongoose';
import { ConversationDocument } from './conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDocument } from './message.schema';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
import { Message } from 'src/domain/entities/message.entity';

export class MongoConversationRepository implements ConversationRepository {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel('Message')
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async markAsRead(
    conversation: Conversation,
    participantPseudo: string,
  ): Promise<boolean> {
    const response = await this.messageModel
      .updateMany(
        {
          conversationIdentifier: conversation.identifier,
          readBy: { $nin: [participantPseudo] },
        },
        { $addToSet: { readBy: participantPseudo } },
      )
      .exec();
    return response.acknowledged;
  }

  async countUnreadMessages(
    conversation: Conversation,
    participantPseudo: string,
  ): Promise<number> {
    const result = await this.messageModel.aggregate([
      {
        $match: {
          conversationIdentifier: conversation.identifier,
          readBy: { $nin: [participantPseudo] },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    return result[0]?.count || 0;
  }

  getLastMessage(conversation: Conversation): Promise<Message | null> {
    return this.messageModel
      .findOne({ conversationIdentifier: conversation.identifier })
      .sort({ date: -1 })
      .exec();
  }

  async getConversationByIdentifier(
    identifier: string,
  ): Promise<Conversation | null> {
    const document = await this.conversationModel
      .findOne({ identifier: identifier })
      .exec();
    if (!document) return null;
    return {
      identifier: document.identifier,
      participants: document.participants,
      name: document.name,
      closed: document.closed,
    };
  }

  async getParticipantConversations(
    participantPseudo: string,
  ): Promise<Conversation[]> {
    const documents = await this.conversationModel.find({
      participants: { $in: [participantPseudo] },
    });
    return documents.map((document) => {
      return {
        identifier: document.identifier,
        participants: document.participants,
        name: document.name,
        closed: document.closed,
      };
    });
  }

  async putConversation(conversation: Conversation): Promise<boolean> {
    try {
      const response = await this.conversationModel.updateOne(
        { identifier: conversation.identifier },
        { $set: conversation },
        { upsert: true },
      );

      if (response.acknowledged) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
