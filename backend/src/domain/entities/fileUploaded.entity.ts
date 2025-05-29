import { User } from './user.entity';

export interface FileUploadedIdentifiable {
  identifier: string;
}

export interface FileUploaded extends FileUploadedIdentifiable {
  checksum: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: User;
  path: string;
  getURL(): string;
}
