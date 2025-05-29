import { FileService, RetrieveFileResponse } from './file.service';
import {
  FileUploaded,
  FileUploadedIdentifiable,
} from '../../domain/entities/fileUploaded.entity';
import { FileRepository } from '../../domain/repositories/file.repository';
import * as fsLib from 'node:fs';
import { Error } from 'mongoose';
import * as crypto from 'node:crypto';
import * as stream from 'node:stream';
import { User } from '../../domain/entities/user.entity';
import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import * as process from 'node:process';

export type FileSystemLib = Pick<
  typeof fsLib,
  'writeFileSync' | 'unlinkSync' | 'createReadStream' | 'createWriteStream'
>;

export class DiskFileService implements FileService {
  static UPLOAD_DIR = './upload';
  private fs: FileSystemLib = fsLib;
  constructor(
    @Inject('FileRepository') private fileRepository: FileRepository,
  ) {}

  async retrieveFile(
    identifier: string,
  ): Promise<RetrieveFileResponse | Error> {
    const file = await this.fileRepository.getFile({
      identifier,
    });
    console.log(file);
    if (!file) {
      return new BadRequestException('File not found');
    }
    console.log(`Retrieving file with identifier: ${file.identifier}`);
    try {
      return {
        stream: this.fs.createReadStream(file.path),
        file,
      };
    } catch (error) {
      return new Error(`Failed to read file: ${error.message}`);
    }
  }

  async deleteFile(
    identifier: FileUploadedIdentifiable,
    authenticatedUser: User,
  ): Promise<boolean | Error> {
    const file = await this.fileRepository.getFile(identifier);
    if (!file)
      return new BadRequestException(
        'Cannot remove a file that does not exist',
      );
    if (file.uploadedBy.pseudo !== authenticatedUser.pseudo)
      return new UnauthorizedException("You can't delete this file");
    await this.fileRepository.deleteFile(identifier);
    try {
      this.fs.unlinkSync(file.path);
      return true;
    } catch (error) {
      return new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async writeFile(
    fileToUpload: Express.Multer.File,
    authenticatedUser: User,
  ): Promise<FileUploaded | Error> {
    const checksum = await this.getFileChecksum(
      this.fs.createReadStream(fileToUpload.path),
    );
    if (checksum instanceof Error) return checksum;
    const file = await this.fileRepository.getFileByChecksum(checksum);
    if (file) return file;
    const readStream = this.fs.createReadStream(fileToUpload.path);
    const path = `${DiskFileService.UPLOAD_DIR}/${fileToUpload.filename}`;
    const writeStream = this.fs.createWriteStream(path);
    try {
      readStream.pipe(writeStream);
      return new Promise((resolve, _) => {
        readStream.on('end', async () => {
          const fileUploaded: FileUploaded = {
            identifier: crypto.randomUUID(),
            checksum,
            path,
            fileName: fileToUpload.filename,
            mimeType: fileToUpload.mimetype,
            size: fileToUpload.size,
            uploadedBy: authenticatedUser,
            uploadedAt: new Date(),
            getURL(): string {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              return `${process.APP_URL}/file/${this.identifier}`;
            },
          };

          await this.fileRepository.putFile(fileUploaded);
          this.fs.unlinkSync(fileToUpload.path);
          resolve(fileUploaded);
        });
      });
    } catch (error) {
      return new Error(`Failed to delete file: ${error.message}`);
    }
  }

  getFileChecksum(
    contentStream: stream.Stream.Readable,
  ): Promise<string | Error> {
    return new Promise((resolve) => {
      const hash = crypto.createHash('sha1');
      hash.setEncoding('hex');

      contentStream.on('end', () => {
        hash.end();
        resolve(hash.read());
      });

      contentStream.on('error', (error) => {
        resolve(
          new Error('An error occurred while reading file :' + error.message),
        );
      });

      contentStream.pipe(hash);
    });
  }
}
