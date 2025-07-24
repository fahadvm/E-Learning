import mongoose, { Document, ObjectId, Types } from "mongoose";
import { Request } from "express";

export interface GooglePayLoad {
  // googleUser: boolean;
  googleId: string;
  username: string;
  email: string;
  image: string;
  // role: string;
}