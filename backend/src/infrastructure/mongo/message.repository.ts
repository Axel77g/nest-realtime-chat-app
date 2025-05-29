import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDocument } from './message.schema';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';

class MessageConversationMetaInfos {}

export class MongoMessageRepository implements MessageRepository {
  constructor(
    @InjectModel('Message')
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async getMessageConversationMetaInfos(
    conversationIdentifier: string,
    readBy: string,
  ): Promise<MessageConversationMetaInfos> {
    const response = await this.messageModel.aggregate([
      {
        $match: {
          conversationIdentifier,
        },
      },
      {
        $facet: {
          unreadCount: [
            { $match: { readBy: { $ne: readBy } } },
            { $count: 'count' },
          ],
          lastMessage: [
            { $sort: { date: -1 } },
            { $limit: 1 },
            { $project: { _id: 0, content: 1 } },
          ],
        },
      },
      {
        $project: {
          unreadCount: { $arrayElemAt: ['$unreadCount.count', 0] },
          lastMessage: { $arrayElemAt: ['$lastMessage.content', 0] },
        },
      },
    ]);

    return {
      unreadCount: response[0].unreadCount || 0,
      lastMessage: response[0].lastMessage || null,
    };
  }
  getMessageByIdentifier(identifier: string): Promise<Message | null> {
    return this.messageModel.findOne({ identifier: identifier });
  }

  async putMessage(message: Message): Promise<boolean> {
    //upsert message
    try {
      const response = await this.messageModel.updateOne(
        { identifier: message.identifier },
        { $set: message },
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
  async deleteMessage(identifier: string): Promise<boolean> {
    try {
      const response = await this.messageModel.deleteOne({
        identifier: identifier,
      });

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
  async getMessagesByConversationIdentifier(
    conversationIdentifier: string,
    startMessageIdentifier?: string,
    _?: string,
  ): Promise<Message[]> {
    try {
      const messagesDocument = await this.messageModel
        .find({
          conversationIdentifier: conversationIdentifier,

          ...(startMessageIdentifier && {
            date: {
              $gt: (
                await this.messageModel.findOne({
                  identifier: startMessageIdentifier,
                })
              )?.date,
            },
          }),
        })
        .sort({
          date: -1,
        });

      if (messagesDocument) {
        return messagesDocument;
      } else {
        return [];
      }
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
