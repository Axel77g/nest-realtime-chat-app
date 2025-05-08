import { Schema, Document } from 'mongoose';

export const MessageSchema = new Schema({
  identifier: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  readBy: [{ type: String, required: true }],
  content: { type: String, required: true },
  date: { type: Date, required: true },
  conversationIdentifier: { type: String, required: true },
  attachements: [
    {
      identifier: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, required: true },
      size: { type: Number, required: true },
      url: { type: String, required: true },
    },
  ],
});

export interface MessageDocument extends Document {
  identifier: string;
  author: string;
  readBy: string[];
  content: string;
  date: Date;
  conversationIdentifier: string;
  attachements?: {
    identifier: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}
