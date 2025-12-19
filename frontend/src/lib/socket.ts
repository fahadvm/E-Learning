import { showSuccessToast } from "@/utils/Toast";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (
  userId: string,
  onMessageReceived: (data: any) => void = () => { },
  onTypingReceived: (data: { senderId: string }) => void = () => { },
  onMessageRead: (data: { messageId: string; chatId: string }) => void = () => { },
  onMessageReaction: (data: { messageId: string; chatId: string; userId: string; reaction: string }) => void = () => { },
  onMessageDeleted: (data: { messageId: string; chatId: string }) => void = () => { },
  onMessageEdited: (data: { messageId: string; chatId: string; newMessage: string }) => void = () => { }
) => {
  if (!socket) {
    socket = io("http://localhost:8000"); // backend URL
  }

  // Join with userId
  socket.emit("join", userId);

  // Listen for incoming messages
  socket.on("receive_message", onMessageReceived);

  // Listen for typing events
  socket.on("typing", onTypingReceived);

  // Listen for message read events
  socket.on("message_read", onMessageRead);

  // Listen for message reaction events
  socket.on("message_reaction", onMessageReaction);

  // Listen for message deletion events
  socket.on("message_deleted", onMessageDeleted);

  // Listen for message edit events
  socket.on("message_edited", onMessageEdited);

  socket.on("receive_notification", (data) => {
    console.log("🔔 Notification received:", data);
    showSuccessToast(`🔔 ${data.title}: ${data.message}`);
  });

  return socket;
};

export const joinChat = (chatId: string) => {
  if (socket) {
    socket.emit("join_chat", chatId);
  }
};

export const sendMessage = (data: { senderId: string; receiverId: string; message: string; chatId: string; senderType: string; receiverType: string }) => {
  if (socket) {
    socket.emit("send_message", data);
  }
};

export const sendTyping = (data: { senderId: string; receiverId: string }) => {
  if (socket) {
    socket.emit("typing", data);
  }
};

export const sendReadMessage = (data: { chatId: string; messageId: string; senderId: string; receiverId: string }) => {
  if (socket) {
    socket.emit("read_message", data);
  }
};

export const sendMessageReaction = (data: { chatId: string; messageId: string; userId: string; reaction: string; receiverId: string }) => {
  if (socket) {
    socket.emit("react_message", data);
  }
};

export const sendDeleteMessage = (data: { chatId: string; messageId: string; senderId: string; receiverId: string }) => {
  if (socket) {
    socket.emit("delete_message", data);
  }
};

export const sendEditMessage = (data: { chatId: string; messageId: string; senderId: string; newMessage: string; receiverId: string }) => {
  if (socket) {
    socket.emit("edit_message", data);
  }
};
export const sendNotification = (data: { receiverId: string; title: string; message: string; }) => {
  if (socket) {
    console.log("emiting send notification here")
    socket.emit("send_notification", data);
  }
};



export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};