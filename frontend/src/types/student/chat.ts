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
  type?: MessageType;
  fileUrl?: string;
  isRead?: boolean;
  delivered?: boolean;
  createdAt: string;         
  updatedAt?: string;
  reaction?: IReaction[];
}

export interface Teacher {
    _id: string;
    name: string;
    profilePicture?: string;
    about?: string;
    courseCount?: number;
}

export interface PurchasedCourse {
    _id: string;
    title: string;
    coverImage?: string;
    teacherId: Teacher;
    purchasedAt: string;
    progress?: number;
}

export type TabType = "instructors" | "courses";

export interface IConversationTeacher {
  _id: string;
  name: string;
  profilePicture?: string;
}




export interface IConversation {
  _id: string
  lastMessage: string
  teacherId: {
    _id: string
    name: string
    profilePicture?: string
  }
  unread: number
  online: boolean
  updatedAt: string
}