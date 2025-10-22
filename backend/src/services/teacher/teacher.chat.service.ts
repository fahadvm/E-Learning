import { inject, injectable } from 'inversify';
import { IChatRepository } from '../../core/interfaces/repositories/IChatRepository';
import { TYPES } from '../../core/di/types';
import { IMessage } from '../../models/message'; 
import { IChat } from '../../models/chat';  
import { ITeacherChatService } from '../../core/interfaces/services/teacher/ITeacherChatService';

@injectable()
export class TeacherChatService implements ITeacherChatService {
  constructor(
    @inject(TYPES.ChatRepository) private chatRepository: IChatRepository
  ) {}

  async sendMessage(senderId: string, receiverId: string, message: string): Promise<IMessage> {  
    return this.chatRepository.saveMessage(senderId, receiverId, message);
  }

  async getMessages(chatId: string): Promise<IMessage[]> {
    return this.chatRepository.getTeacherMessages(chatId);
  }

  async getChatDetails(chatId: string): Promise<IChat | null> {
    return this.chatRepository.getChatDetails(chatId);
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    const chat = await this.chatRepository.getTeacherChats(userId );
    return chat;
  }
}