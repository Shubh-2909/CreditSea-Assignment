// src/interfaces/index.ts

import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "user" | "verifier";
  isVerified: boolean;
  otp: {
    code: string;
    expiry: Date;
  };
  generateAuthToken: () => string;
  comparePassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Document {
  generateOTP: () => string;
  hashPassword: (password: string) => Promise<string>;
}

export interface IApplication extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedBy: Types.ObjectId | IUser | null;
  content: Record<string, any>;
}
