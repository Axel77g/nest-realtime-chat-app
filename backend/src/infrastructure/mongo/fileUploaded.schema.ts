import { Schema, Types } from 'mongoose';

export const FileUploadedSchema = new Schema({
  identifier: { type: String, required: true, unique: true },
  checksum: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, default: 0 },
  uploadedAt: {
    type: Date,
    required: true,
  },
  uploadedBy: { type: Types.ObjectId, ref: 'User', required: true },
  path: { type: String, required: true },
});

export interface FileUploadDocument {
  fileName: string;
  identifier: string;
  mimeType: string;
  checksum: string;
  uploadedAt: Date;
  size: number;
  path: string;
  uploadedBy: Types.ObjectId;
  getURL(): string;
}
