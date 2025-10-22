import { inject, injectable } from 'inversify';
import { IChatService } from '../../core/interfaces/services/student/IStudentChatService';
import { IChatRepository } from '../../core/interfaces/repositories/IChatRepository';
import { TYPES } from '../../core/di/types';
import { IMessage, Message } from '../../models/message';  // Adjust path
import { IChat } from '../../models/chat';  // Adjust path
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ChatRepository) private chatRepository: IChatRepository
  ) { }

  async sendMessage(senderId: string, receiverId: string, message: string , chatId :string ): Promise<IMessage> { 
    if(!senderId || !chatId ||!message ||!receiverId) throwError(MESSAGES.REQUIRED_FIELDS_MISSING);
    return this.chatRepository.saveMessage(senderId, receiverId, message);
  }

  async getMessages(chatId: string, limit: number, before: string): Promise<IMessage[]> {
    let beforeDate = new Date(before);


    return this.chatRepository.getStudentMessages(chatId, limit, beforeDate);
  }

  async getChatDetails(chatId: string): Promise<IChat | null> {
    return this.chatRepository.getChatDetails(chatId);
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    const chat = await this.chatRepository.getStudentChats(userId);
    return chat;
  }


  
// markMessageAsRead(chatId: string, messageId: string): Promise<IMessage>;
//   addReaction(chatId: string, messageId: string, userId: string, reaction: string): Promise<IMessage>;
async addReaction(chatId: string, messageId: string, userId: string, reaction: string): Promise<void> {
   await Message.updateOne(
    { _id: messageId, chatId },
    { $push: { reactions: { userId, reaction } } } 
  );
}
async markMessageAsRead(chatId: string, messageId: string):Promise<void> {
  await Message.updateOne({ _id: messageId, chatId }, { $set: { isRead: true } });
}



async deleteMessage(chatId: string, messageId: string, senderId: string):Promise<void> {
  if(!senderId || chatId) throwError(MESSAGES.ID_REQUIRED);
  
  await Message.findByIdAndDelete(messageId);
}
async editMessage(chatId: string, messageId: string, senderId: string, newMessage: string):Promise<void> {
    if(!senderId || chatId) throwError(MESSAGES.ID_REQUIRED);
  await Message.findByIdAndUpdate(messageId,{ $set: { message: newMessage, edited: true } });
}


}