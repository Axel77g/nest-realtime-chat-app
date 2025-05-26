import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async findByPseudo(pseudo: string): Promise<User | null> {
    const document = await this.userModel.findOne({ pseudo }).exec();
    if (!document) return null;
    return {
      pseudo: document.pseudo,
      password: document.password,
      color: document.color,
      avatarURL: document.avatarURL || null,
    };
  }

  private async upsert(user: User): Promise<User> {
    const document = await this.userModel
      .findOneAndUpdate(
        { pseudo: user.pseudo },
        { password: user.password, color: user.color },
        { upsert: true, new: true },
      )
      .exec();
    return {
      pseudo: document.pseudo,
      password: document.password,
      color: document.color,
      avatarURL: document.avatarURL || null,
    };
  }

  create(user: User): Promise<User> {
    return this.upsert(user);
  }

  update(user: User): Promise<User> {
    return this.upsert(user);
  }

  async delete(pseudo: string): Promise<boolean> {
    try {
      const result = await this.userModel.deleteOne({ pseudo }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}
