import { FileRepository } from '../../domain/repositories/file.repository';
import {
  FileUploaded,
  FileUploadedIdentifiable,
} from '../../domain/entities/fileUploaded.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileUploadDocument } from './fileUploaded.schema';
import { User } from '../../domain/entities/user.entity';
import { UserDocument } from './user.schema';
import * as process from 'node:process';

export class MongoFileRepository implements FileRepository {
  constructor(
    @InjectModel('FileUploaded')
    private readonly fileModel: Model<FileUploadDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}
  async deleteFile(identifier: FileUploadedIdentifiable): Promise<boolean> {
    try {
      const response = await this.fileModel.deleteOne({
        identifier: identifier.identifier,
      });
      if (response.deletedCount === 0) {
        console.warn(`No file found with identifier: ${identifier.identifier}`);
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
    }
  }

  async getFile(
    identifier: FileUploadedIdentifiable,
  ): Promise<FileUploaded | null> {
    try {
      const document = await this.fileModel
        .findOne({
          identifier: identifier.identifier,
        })
        .populate<{ uploadedBy: User }>('uploadedBy', 'pseudo color avatarURL');
      if (!document) return null;
      return {
        ...document.toObject(),
        getURL(): string {
          return `${process.env.APP_URL}/files/${document.identifier}`;
        },
      };
    } catch (e) {
      console.error(e);
    }
  }

  async putFile(file: FileUploaded): Promise<boolean> {
    try {
      const userObjectId = await this.userModel
        .findOne({ pseudo: file.uploadedBy.pseudo })
        .select('_id');

      if (!userObjectId) {
        throw new Error('User not found for the given pseudo.');
      }

      const document: FileUploadDocument = {
        ...file,
        uploadedBy: userObjectId._id,
      };

      const response = await this.fileModel.updateOne(
        { identifier: file.identifier },
        { $set: document },
        { upsert: true },
      );
      if (response.acknowledged && response.modifiedCount > 0) {
        return true;
      }
      console.warn(
        "File not updated, either it didn't change or was not found.",
      );
      return false;
    } catch (e) {
      console.error(e);
      return Promise.resolve(false);
    }
  }

  async getFileByChecksum(checksum: string): Promise<FileUploaded | null> {
    try {
      const document = await this.fileModel
        .findOne({ checksum })
        .populate<{ uploadedBy: User }>('uploadedBy', 'pseudo color avatarURL');
      if (!document) return null;
      return {
        ...document.toObject(),
        getURL(): string {
          return `${process.env.APP_URL}/files/${document.identifier}`;
        },
      };
    } catch (e) {
      console.error(e);
      return Promise.resolve(null);
    }
  }
}
