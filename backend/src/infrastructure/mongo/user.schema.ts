import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  pseudo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export interface UserDocument extends Document {
  pseudo: string;
  password: string;
}
