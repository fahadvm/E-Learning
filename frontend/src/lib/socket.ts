import { io, Socket } from "socket.io-client";

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
   receiverId:  string;
  message: string;
  createdAt: string;
}

export interface NotificationData {
  id: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}


let socket: Socket | null = null;

export function initSocket(
  userId: string,
  onMessage: (message: Message) => void,
  onNotification?: (data: NotificationData) => void
) {
  if (socket) return socket;

  socket = io("http://localhost:8000", {
    withCredentials: true,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
    socket?.emit("register", userId);
  });

  socket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect_error:", err);
  });

  // Chat messages
  socket.on("receiveMessage", (message: Message) => {
    onMessage(message);
  });

  // Notifications (new)
  socket.on("receiveNotification", (data: NotificationData) => {
    console.log("🔔 Notification received:", data);
    if (onNotification) onNotification(data);
  });

  return socket;
}

export function sendMessage(data: {
  senderId: string;
  receiverId: string;
  content: string;
}) {
  console.log("sending message is ", data);
  socket?.emit("sendMessage", data);
}

export function sendNotification(data: {
  receiverId: string;
  title: string;
  message: string;
  type?: string;
}) {
  console.log("Sending notification:", data);
  socket?.emit("sendNotification", data);
}

export function markNotificationRead(notificationId: string) {
  socket?.emit("markNotificationRead", { notificationId });
}