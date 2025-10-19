// frontend/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (userId: string, onMessageReceived: (data: any) => void) => {
  if (!socket) {
    socket = io("http://localhost:8000"); // backend URL
  }

  // Join with userId
  socket.emit("join", userId);

  // Listen for incoming messages
  socket.on("receive_message", onMessageReceived);

  return socket;
};

export const sendMessage = (data: { senderId: string; receiverId: string; message: string }) => {
  if (socket) {
    socket.emit("send_message", data);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
