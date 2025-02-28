import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  password: string; // Note: In a real app, never store plain text passwords
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);