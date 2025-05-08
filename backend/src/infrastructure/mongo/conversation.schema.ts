import { Schema, Document } from 'mongoose';

export const ConversationSchema = new Schema({
  identifier: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  participants: [{ type: String, required: true }],
  closed: { type: Boolean, required: true },
});

export interface ConversationDocument extends Document {
  identifier: string;
  name: string;
  participants: string[];
  closed: boolean;
}
