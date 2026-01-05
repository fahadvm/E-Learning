import { inject, injectable } from 'inversify';
import { IChatService } from '../../core/interfaces/services/student/IStudentChatService';
import { IChatRepository } from '../../core/interfaces/repositories/IChatRepository';
import { TYPES } from '../../core/di/types';
import { IMessage, Message } from '../../models/message';  // Adjust path
import { IChat } from '../../models/chat';  // Adjust path
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IOrderRepository } from '../../core/interfaces/repositories/IOrderRepository';
import { ICourse } from '../../models/Course';
import { ITeacher } from '../../models/Teacher';

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ChatRepository) private _chatRepository: IChatRepository,
    @inject(TYPES.OrderRepository) private readonly _orderRepo: IOrderRepository,
  ) { }

  async sendMessage(senderId: string, message: string, chatId: string, senderType: string, receiverId?: string, receiverType?: string, fileUrl?: string, messageType?: string): Promise<IMessage> {
    if (!senderId || !chatId || !message) throwError(MESSAGES.REQUIRED_FIELDS_MISSING);

    return this._chatRepository.saveMessage(senderId, message, chatId, senderType, receiverId, receiverType, fileUrl, messageType);
  }

  async startChat(studentId: string, teacherId: string): Promise<IChat> {
    if (!studentId || !teacherId) throwError(MESSAGES.REQUIRED_FIELDS_MISSING);
    return this._chatRepository.findOrCreateDirectChat(studentId, teacherId);
  }

  async getMessages(chatId: string, limit: number, before: string): Promise<IMessage[]> {
    const beforeDate = before ? new Date(before) : undefined;

    return this._chatRepository.getStudentMessages(chatId, limit, beforeDate);
  }

  async getChatDetails(chatId: string): Promise<IChat | null> {
    return this._chatRepository.getChatDetails(chatId);
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    const chat = await this._chatRepository.getStudentChats(userId);
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
  async markMessageAsRead(chatId: string, messageId: string): Promise<void> {
    await Message.updateOne({ _id: messageId, chatId }, { $set: { isRead: true } });
  }



  async deleteMessage(chatId: string, messageId: string, senderId: string): Promise<void> {
    if (!senderId || !chatId) throwError(MESSAGES.ID_REQUIRED);

    const deleted = await Message.findByIdAndDelete(messageId);
    if (!deleted) throwError(MESSAGES.MESSAGE_EDIT_FAILED);


  }
  async editMessage(chatId: string, messageId: string, senderId: string, newMessage: string): Promise<void> {
    if (!senderId || !chatId) throwError(MESSAGES.ID_REQUIRED);

    const edit = await Message.findByIdAndUpdate(messageId, { $set: { message: newMessage, edited: true } });
    if (!edit) throwError(MESSAGES.MESSAGE_EDIT_FAILED);
  }

  async getTeachersFromPurchases(
    studentId: string
  ): Promise<{
    teachers: {
      _id: string;
      name: string;
      profilePicture?: string;
      about?: string;
      courseCount: number;
      hasChat: boolean;
    }[];
    courses: ICourse[];
  }> {
    // 1) Fetch orders populated with courses → teacher
    const enrollments = await this._orderRepo.getOrdersByStudentId(studentId);

    const teacherMap = new Map<
      string,
      {
        _id: string;
        name: string;
        profilePicture?: string;
        about?: string;
        courseCount: number;
      }
    >();

    const purchasedCourses: ICourse[] = [];

    for (const order of enrollments) {
      if (!order.courses || order.courses.length === 0) continue;

      for (const courseItem of order.courses) {
        if (!courseItem) continue;

        const course = courseItem as unknown as ICourse;
        purchasedCourses.push(course);

        const teacher = course.teacherId as unknown as ITeacher;

        if (!teacher) continue;

        const tid = String(teacher._id);

        if (!teacherMap.has(tid)) {
          teacherMap.set(tid, {
            _id: tid,
            name: teacher.name,
            profilePicture: teacher.profilePicture,
            about: teacher.about,
            courseCount: 1,
          });
        } else {
          teacherMap.get(tid)!.courseCount++;
        }
      }
    }


    // 3) Check chat threads
    const chats = await this._chatRepository.getStudentChats(studentId);
    const chatTeacherIds = new Set(chats.map((c) => String(c.teacherId)));

    // 4) Final teachers array
    const teachers = Array.from(teacherMap.values()).map((t) => ({
      ...t,
      hasChat: chatTeacherIds.has(t._id),
    }));

    // 5) Return teachers + purchased courses

    return {
      teachers,
      courses: purchasedCourses,
    };
  }
}
