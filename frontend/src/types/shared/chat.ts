export type MessageType = "text" | "image" | "file";

export interface IReaction {
    userId: string;
    reaction: string;
}

export interface IChatMessage {
    _id: string;
    chatId: string;
    senderId: string;
    senderType: string;
    receiverId?: string;
    receiverType?: string;
    message: string;
    type?: MessageType;
    fileUrl?: string;
    isRead?: boolean;
    createdAt: string;
    updatedAt?: string;
    reaction?: IReaction[];
}

export interface IChatParticipant {
    _id: string;
    name: string;
    profilePicture?: string;
    email?: string;
    role?: string;
}

export interface IChat {
    _id: string;
    type: 'direct' | 'group';
    participants: string[]; // Or detailed objects if populated
    groupName?: string;
    groupPhoto?: string;
    lastMessage?: string;
    unreadCount?: number;
    companyId?: string;
}
