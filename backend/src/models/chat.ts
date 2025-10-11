          import { Schema, model, Types, Document } from "mongoose";

export interface IChat extends Document {
  participants: Types.ObjectId[];  // student + teacher IDs
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  isActive: boolean;
  lastMessage?: string;
}

const chatSchema = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true }
    ],
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMessage: { type: String },
  },
  { timestamps: true }
);

export const Chat = model<IChat>("Chat", chatSchema);
