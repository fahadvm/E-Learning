import { Schema, model, Document, Types } from 'mongoose';

export interface IReaction {
  userId: Types.ObjectId;
  reaction: string; 
}

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  isRead: boolean;
  delivered: boolean;
  createdAt: Date;
  updatedAt: Date;
  reaction: IReaction[];
}


const reactionSchema = new Schema<IReaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    reaction: { type: String, required: true },
  },
  { _id: false } 
);

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    fileUrl: { type: String },
    isRead: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
     reaction: [reactionSchema],
  },
  {
    timestamps: true, 
    versionKey: false, 
  }
);

export const Message = model<IMessage>('Message', messageSchema);
