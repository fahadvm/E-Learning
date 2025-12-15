import { injectable } from 'inversify';
import { Chat, IChat } from '../models/chat';
import { IMessage, Message } from '../models/message';
import { IChatRepository } from '../core/interfaces/repositories/IChatRepository';
import { Types } from 'mongoose';

@injectable()
export class ChatRepository implements IChatRepository {
  async findOrCreateChat(participants: string[]) {
    const participantIds = participants.map(id => new Types.ObjectId(id));
    const chat = await Chat.findOne({ participants: { $all: participantIds } });
    if (chat) return chat;

    const newChat = await Chat.create({ participants: participantIds });
    return newChat;
  }

  async saveMessage(senderId: string, content: string, chatId: string, senderType: string, receiverId?: string, receiverType?: string, fileUrl?: string, messageType: string = 'text') {
    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
    } else if (receiverId) {
      chat = await this.findOrCreateChat([senderId, receiverId]);
    }

    if (!chat) throw new Error("Chat not found");

    const messageData: any = {
      chatId: chat._id,
      senderId: new Types.ObjectId(senderId),
      senderType: senderType,
      message: content,
      type: messageType,
      fileUrl: fileUrl
    };

    if (receiverId) {
      messageData.receiverId = new Types.ObjectId(receiverId);
      messageData.receiverType = receiverType;
    }

    const message = await Message.create(messageData);
    await Chat.findByIdAndUpdate(chat._id, { lastMessage: content });
    return message;
  }

  async getStudentMessages(chatId: string, limit: number, before?: Date) {
    const query: any = { chatId: new Types.ObjectId(chatId) };
    console.log(before)

    return Message.find(query).populate('receiverId', 'name email profilePicture').sort({ createdAt: 1 });
  }

  async getTeacherMessages(chatId: string, limit?: number, before?: Date) {
    const query: any = { chatId: new Types.ObjectId(chatId) };
    if (before) {
      query.createdAt = { $lt: before };
    }
    return Message.find(query).populate('receiverId', 'name email profilePicture').sort({ createdAt: 1 });
  }

  async getChatDetails(chatId: string): Promise<IChat | null> {
    return Chat.findById(chatId)
      .populate('teacherId', 'name email profilePicture')
      .populate('studentId', 'name email profilePicture');
  }

  async getStudentChats(userId: string) {
    const chats = await Chat.find({ studentId: new Types.ObjectId(userId) })
      .populate('teacherId', 'name email profilePicture')
      .lean();

    const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
      const unread = await Message.countDocuments({
        chatId: chat._id,
        receiverId: new Types.ObjectId(userId),
        isRead: false
      });
      return { ...chat, unread };
    }));

    return chatsWithUnread;
  }

  async getTeacherChats(userId: string) {
    const chats = await Chat.find({ teacherId: new Types.ObjectId(userId) })
      .populate('studentId', 'name email profilePicture')
      .lean();

    const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
      const unread = await Message.countDocuments({
        chatId: chat._id,
        receiverId: new Types.ObjectId(userId),
        isRead: false
      });
      return { ...chat, unread };
    }));

    return chatsWithUnread;
  }

  async findOrCreateCompanyGroup(companyId: string, groupName: string) {
    let chat = await Chat.findOne({ companyId: new Types.ObjectId(companyId), type: 'group' });
    if (!chat) {
      chat = await Chat.create({
        companyId: new Types.ObjectId(companyId),
        type: 'group',
        groupName: groupName,
        participants: []
      });
    }
    return chat;
  }

  async addParticipantToGroup(chatId: string, participantId: string) {
    return Chat.findByIdAndUpdate(chatId, {
      $addToSet: { participants: new Types.ObjectId(participantId) }
    }, { new: true });
  }

  async removeParticipantFromGroup(chatId: string, participantId: string) {
    return Chat.findByIdAndUpdate(chatId, {
      $pull: { participants: new Types.ObjectId(participantId) }
    }, { new: true });
  }

  async getCompanyGroupChat(companyId: string) {
    return Chat.findOne({ companyId: new Types.ObjectId(companyId), type: 'group' });
  }
}