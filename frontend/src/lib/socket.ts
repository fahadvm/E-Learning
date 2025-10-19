import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (
  userId: string,
  onMessageReceived: (data: any) => void,
  onTypingReceived: (data: { senderId: string }) => void,
  onMessageRead: (data: { messageId: string; chatId: string }) => void,
  onMessageReaction: (data: { messageId: string; chatId: string; userId: string; reaction: string }) => void
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

  return socket;
};

export const sendMessage = (data: { senderId: string; receiverId: string; message: string; chatId: string }) => {
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

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};