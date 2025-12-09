import { IMessage } from '../../../models/message';
import { IChat } from '../../../models/chat';

export interface IChatRepository {
  findOrCreateChat(participants: string[]): Promise<IChat>;
  saveMessage(senderId: string, content: string, chatId: string, senderType: string, receiverId?: string, receiverType?: string, fileUrl?: string, messageType?: string): Promise<IMessage>;
  getStudentMessages(chatId: string, limit: number, before?: Date): Promise<IMessage[]>;
  getTeacherMessages(chatId: string, limit?: number, before?: Date): Promise<IMessage[]>;
  getChatDetails(chatId: string): Promise<IChat | null>;
  getStudentChats(userId: string): Promise<IChat[]>;
  getTeacherChats(userId: string): Promise<IChat[]>;
  findOrCreateCompanyGroup(companyId: string, groupName: string): Promise<IChat>;
  addParticipantToGroup(chatId: string, participantId: string): Promise<IChat | null>;
  removeParticipantFromGroup(chatId: string, participantId: string): Promise<IChat | null>;
  getCompanyGroupChat(companyId: string): Promise<IChat | null>;
}
