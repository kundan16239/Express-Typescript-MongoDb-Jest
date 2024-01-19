import mongoose, { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
