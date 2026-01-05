import { IMessage } from '../../../../models/message';
import { IChat } from '../../../../models/chat';

export interface ITeacherChatService {
  sendMessage(senderId: string, receiverId: string, content: string): Promise<IMessage>;
  startChat(studentId: string, teacherId: string): Promise<IChat>;
  getMessages(chatId: string): Promise<IMessage[]>;
  getUserChats(userId: string): Promise<IChat[]>;
  getChatDetails(chatId: string): Promise<IChat | null>
}
