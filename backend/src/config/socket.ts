import { Server, Socket } from "socket.io";
import container from "../core/di/container";
import { TYPES } from "../core/di/types";
import { IChatService } from "../core/interfaces/services/student/IStudentChatService";
import { IStudentNotificationService } from "../core/interfaces/services/student/IStudentNotificationService";
import dotenv from "dotenv";
dotenv.config();


const chatService = container.get<IChatService>(TYPES.ChatService);

export interface TokenPayload {
  id: string;
  role: string;
}

interface AuthenticatedSocket extends Socket {
  userId: string;
  role: string;
}

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Map to track online users
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  // Broadcast online users to all clients
  const broadcastOnlineUsers = () => {
    const users = Array.from(onlineUsers.keys());
    io.emit("onlineUsers", users);
  };

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // When user joins with their ID
    socket.on("join", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log("Online users:", Array.from(onlineUsers.keys()));
      broadcastOnlineUsers(); // Broadcast updated online users
    });

    // Listen for messages
    socket.on("send_message", (data: { senderId: string; receiverId: string; message: string }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", data);
        chatService.sendMessage(data.senderId, data.receiverId, data.message);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Remove from online users
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) onlineUsers.delete(key);
      });
      broadcastOnlineUsers(); // Broadcast updated online users
    });
  });

  // Periodically broadcast online users every 10 seconds
  setInterval(broadcastOnlineUsers, 10000);
}