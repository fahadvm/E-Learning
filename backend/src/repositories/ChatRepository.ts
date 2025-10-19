import { injectable } from "inversify";
import { Chat, IChat } from "../models/chat";  
import { Message } from "../models/message";  
import { IChatRepository } from "../core/interfaces/repositories/IChatRepository";  
import { Types } from "mongoose";

@injectable()
export class ChatRepository implements IChatRepository {
  async findOrCreateChat(participants: string[]) {
    // Convert string IDs to ObjectId
    const participantIds = participants.map(id => new Types.ObjectId(id));
    const chat = await Chat.findOne({ participants: { $all: participantIds } });
    // console.log("found one of most chat i got ",chat)
    if (chat) return chat;

    const newChat = await Chat.create({ participants: participantIds });
    return newChat;
  }

  async saveMessage(senderId: string, receiverId: string, content: string) {
    // console.log("here the saving message with :",senderId,receiverId)
    const chat = await this.findOrCreateChat([senderId, receiverId]);
    // console.log("founded chat is" ,chat )
    const message = await Message.create({
      chatId: chat._id,
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      message: content,  // Updated to match schema
    });
    await Chat.findByIdAndUpdate(chat._id, { lastMessage: content });
    return message;
  }

  async getStudentMessages(chatId: string  , limit: number, before?: Date) {
    console.log("off set is working now :  ",before)
    const query: any = { chatId: new Types.ObjectId(chatId) };
    if (before) {
      
      query.createdAt = { $lt: before };
      
    }
    return Message.find({ chatId: new Types.ObjectId(chatId) }).populate(`receiverId`, "name email profilePicture").sort({ createdAt: 1 });
  }
  async getTeacherMessages(chatId: string ) {
    
    return Message.find({ chatId: new Types.ObjectId(chatId) }).populate(`receiverId`, "name email profilePicture").sort({ createdAt: 1 });
  }
 async getChatDetails(chatId: string): Promise<IChat | null> {
  return Chat.findById(chatId)
    .populate('teacherId', 'name email profilePicture')
    .populate('studentId', 'name email profilePicture');
}

  async getStudentChats(userId: string) {
    return Chat.find({ studentId: new Types.ObjectId(userId) }).populate(`teacherId`, "name email profilePicture");
  }
  async getTeacherChats(userId: string) {
    return Chat.find({ teacherId: new Types.ObjectId(userId) }).populate(`studentId`, "name email profilePicture");
  }
}