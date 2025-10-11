import { Schema, model, Document, Types } from 'mongoose';

// TS Interface
export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCounts: Map<string, number>; // Maps userId to their unread count
}

// Mongoose Schema
const conversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: String },
  lastMessageTime: { type: Date },
  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  },
}, { timestamps: true });

export const ConversationModel = model<IConversation>('Conversation', conversationSchema);