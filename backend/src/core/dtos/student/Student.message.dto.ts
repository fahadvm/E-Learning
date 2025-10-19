export interface IMessageDTO {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export interface ITeacherInfoDTO {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
}

export interface IChatDTO {
  _id: string;
  participants: string[];
  lastMessage?: string;
  teacherId: ITeacherInfoDTO;
  studentId: string;
}

