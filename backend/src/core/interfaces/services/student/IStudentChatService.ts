import { IMessage } from "../../../../models/message";
import { IChat } from "../../../../models/chat";

export interface IChatService {
  sendMessage(senderId: string, receiverId: string, content: string ,  chatId :string): Promise<IMessage>;
  getMessages(chatId: string, limit: number, before: string): Promise<IMessage[]>;
  getUserChats(userId: string): Promise<IChat[]>;
  getChatDetails(chatId: string): Promise<IChat | null>
  markMessageAsRead(chatId: string, messageId: string): Promise<void>;
  addReaction(chatId: string, messageId: string, userId: string, reaction: string): Promise<void>;
}


// markMessageAsRead(chatId: string, messageId: string): Promise<IMessage>;
//   addReaction(chatId: string, messageId: string, userId: string, reaction: string): Promise<IMessage>;
// async addReaction(chatId: string, messageId: string, userId: string, reaction: string) {
//   await MessageModel.updateOne(
//     { _id: messageId, chatId },
//     { $push: { reactions: { userId, reaction } } }
//   );
// }
// async markMessageAsRead(chatId: string, messageId: string) {
//   await MessageModel.updateOne({ _id: messageId, chatId }, { $set: { read: true } });
// }