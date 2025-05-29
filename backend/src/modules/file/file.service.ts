import {
  FileUploaded,
  FileUploadedIdentifiable,
} from '../../domain/entities/fileUploaded.entity';
import { Error } from 'mongoose';
import stream from 'node:stream';
import { DiskFileService } from './diskFile.service';
import { User } from '../../domain/entities/user.entity';

export interface RetrieveFileResponse {
  file: FileUploaded;
  stream: stream.Stream.Readable;
}
export interface FileService {
  retrieveFile(identifier: string): Promise<RetrieveFileResponse | Error>;

  deleteFile(
    identifier: FileUploadedIdentifiable,
    authenticatedUser: User,
  ): Promise<boolean | Error>;

  writeFile(
    fileToUpload: Express.Multer.File,
    authenticatedUser: User,
  ): Promise<FileUploaded | Error>;

  getFileChecksum(
    fileToUpload: stream.Stream.Readable,
  ): Promise<string | Error>;
}

export const FileServiceProvider = {
  provide: 'FileService',
  useClass: DiskFileService,
};
