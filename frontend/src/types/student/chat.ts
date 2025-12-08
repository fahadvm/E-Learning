export interface IReaction {
  userId: string;           
  reaction: string;
}

export type MessageType = "text" | "image" | "file";

export interface ChatMessage {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: MessageType;
  fileUrl?: string;
  isRead: boolean;
  delivered: boolean;
  createdAt: string;         
  updatedAt: string;
  reaction: IReaction[];
}
