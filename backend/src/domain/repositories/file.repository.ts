import {
  FileUploaded,
  FileUploadedIdentifiable,
} from '../entities/fileUploaded.entity';
import { MongoFileRepository } from '../../infrastructure/mongo/file.repository';

export interface FileRepository {
  getFileByChecksum(checksum: string): Promise<FileUploaded | null>;
  getFile(identifier: FileUploadedIdentifiable): Promise<FileUploaded | null>;
  putFile(file: FileUploaded): Promise<boolean>;
  deleteFile(identifier: FileUploadedIdentifiable): Promise<boolean>;
}

export const FileRepositoryProvider = {
  provide: 'FileRepository',
  useClass: MongoFileRepository,
};
