import { inject, injectable } from "inversify";
import { IChatService } from "../../core/interfaces/services/student/IStudentChatService";
import { IChatRepository } from "../../core/interfaces/repositories/IChatRepository";
import { TYPES } from "../../core/di/types";
import { IMessage } from "../../models/message";  // Adjust path
import { IChat } from "../../models/chat";  // Adjust path

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ChatRepository) private chatRepository: IChatRepository
  ) { }

  async sendMessage(senderId: string, receiverId: string, message: string): Promise<IMessage> {  // Updated param to 'message'
    return this.chatRepository.saveMessage(senderId, receiverId, message);
  }

  async getMessages(chatId: string, limit: number, before: string): Promise<IMessage[]> {
    let beforeDate = new Date(before)


    return this.chatRepository.getStudentMessages(chatId, limit, beforeDate);
  }

  async getChatDetails(chatId: string): Promise<IChat | null> {
    return this.chatRepository.getChatDetails(chatId);
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    const chat = await this.chatRepository.getStudentChats(userId);
    return chat
  }
}