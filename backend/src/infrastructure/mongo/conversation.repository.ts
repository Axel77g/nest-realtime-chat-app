import { Model } from 'mongoose';
import { ConversationDocument } from './conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDocument } from './message.schema';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import {
  Conversation,
  ConversationIdentifiable,
  ConversationPseudoOnly,
} from '../../domain/entities/conversation.entity';
import { Message } from 'src/domain/entities/message.entity';
import { UserDocument } from './user.schema';

export class MongoConversationRepository implements ConversationRepository {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel('Message')
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
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
    conversation: ConversationIdentifiable,
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

  getLastMessage(
    conversation: ConversationIdentifiable,
  ): Promise<Message | null> {
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
      .populate<{ participants: UserDocument[] }>('participants', {
        pseudo: 1,
        color: 1,
        avatarURL: 1,
        _id: 0,
      })
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
    const user = await this.userModel.findOne({
      pseudo: participantPseudo,
    });
    if (!user) {
      throw new Error('User not found, should not happen');
    }
    const documents = await this.conversationModel
      .find({
        participants: { $in: [user._id] },
      })
      .populate<{ participants: UserDocument[] }>('participants', {
        pseudo: 1,
        color: 1,
        avatarURL: 1,
        _id: 0,
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

  async putConversation(
    conversation: Conversation | ConversationPseudoOnly,
  ): Promise<boolean> {
    try {
      const conversationDocument =
        await this.convertConversationToDocument(conversation);

      const response = await this.conversationModel.updateOne(
        { identifier: conversation.identifier },
        { $set: conversationDocument },
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

  async getConversationByParticipants(
    participants: string[],
  ): Promise<Conversation | null> {
    try {
      const usersIds = await this.userModel.find(
        {
          pseudo: { $in: participants },
        },
        {
          _id: 1,
        },
      );

      const document = await this.conversationModel
        .findOne({
          participants: { $all: usersIds, $size: usersIds.length },
          closed: false,
        })
        .populate<{ participants: UserDocument[] }>('participants')
        .exec();
      if (!document) return null;
      return {
        identifier: document.identifier,
        participants: document.participants,
        name: document.name,
        closed: document.closed,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private async convertConversationToDocument(
    conversation: Conversation | ConversationPseudoOnly,
  ): Promise<ConversationDocument> {
    const participantsPseudos = conversation.participants.map(
      (e) => typeof e == 'string',
    )
      ? conversation.participants
      : conversation.participants.map((e) => e.pseudo);

    const participants = await this.userModel.find({
      pseudo: { $in: participantsPseudos },
    });

    return {
      identifier: conversation.identifier,
      participants: participants.map((user) => user._id),
      name: conversation.name,
      closed: conversation.closed || false,
    } as ConversationDocument;
  }
}
