import { Schema, Document, Types } from 'mongoose';

export const UserSchema = new Schema({
  pseudo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  color: { type: String, required: true }, // Ajout de color
  avatarURL: { type: String, required: false }, // URL de l'avatar
});

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  pseudo: string;
  password: string;
  color: string; // Ajout de color
  avatarURL: string | null; // URL de l'avatar
}
