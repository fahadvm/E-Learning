import { IMessage } from '../../../../models/message';
import { IChat } from '../../../../models/chat';
import { ICourse } from '../../../../models/Course';

export interface IChatService {
  sendMessage(senderId: string, message: string, chatId: string, senderType: string, receiverId?: string, receiverType?: string, fileUrl?: string, messageType?: string): Promise<IMessage>;
  startChat(studentId: string, teacherId: string): Promise<IChat>;
  getMessages(chatId: string, limit: number, before: string): Promise<IMessage[]>;
  getUserChats(userId: string): Promise<IChat[]>;
  getChatDetails(chatId: string): Promise<IChat | null>;
  markMessageAsRead(chatId: string, messageId: string): Promise<void>;
  addReaction(chatId: string, messageId: string, userId: string, reaction: string): Promise<void>;
  deleteMessage(chatId: string, messageId: string, senderId: string): Promise<void>;
  editMessage(chatId: string, messageId: string, senderId: string, newMessage: string): Promise<void>;
  getTeachersFromPurchases(studentId: string): Promise<{
    teachers: {
      _id: string;
      name: string;
      profilePicture?: string;
      about?: string;
      courseCount: number;
      hasChat: boolean;
    }[];
    courses: ICourse[];
  }>;
}
