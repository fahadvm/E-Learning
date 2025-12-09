import { Schema, model, Types, Document } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[];
  studentId?: Types.ObjectId;
  teacherId?: Types.ObjectId;
  companyId?: Types.ObjectId;
  type: 'direct' | 'group';
  groupName?: string;
  groupPhoto?: string;
  isActive: boolean;
  lastMessage?: string;
}

// Mongoose Schema
const chatSchema = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, refPath: 'participantModel' }
    ],
    // For specific chat types
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },

    type: { type: String, enum: ['direct', 'group'], default: 'direct' },
    groupName: { type: String },
    groupPhoto: { type: String },

    isActive: { type: Boolean, default: true },
    lastMessage: { type: String },
  },
  { timestamps: true }
);

export const Chat = model<IChat>('Chat', chatSchema);
