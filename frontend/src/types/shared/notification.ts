export interface INotification {
    _id: string;
    recipientId: string;
    senderId?: {
        _id: string;
        name: string;
        profilePicture?: string;
    };
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
    link?: string;
}
