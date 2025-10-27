import { IMessage } from '../../../models/message';
import { IChat } from '../../../models/chat';



export interface IChatRepository {
  findOrCreateChat(participants: string[]): Promise<IChat>;
  saveMessage(senderId: string, receiverId: string, content: string, chatId?:string): Promise<IMessage>;
  getStudentMessages(chatId: string ,limit :number, before?: Date): Promise<IMessage[]>;
  getTeacherMessages(chatId: string , limit?: number, before?: Date): Promise<IMessage[]>;
  getChatDetails(chatId: string): Promise<IChat | null>;
  getStudentChats(userId: string): Promise<IChat[]>;
  getTeacherChats(userId: string): Promise<IChat[]>;
}


