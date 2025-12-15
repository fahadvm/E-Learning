import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import container from '../core/di/container';
import { TYPES } from '../core/di/types';
import { IChatService } from '../core/interfaces/services/student/IStudentChatService';
import { IStudentNotificationService } from '../core/interfaces/services/student/IStudentNotificationService';
import dotenv from 'dotenv';
import logger from '../utils/logger';
dotenv.config();

const chatService = container.get<IChatService>(TYPES.ChatService);
const notificationService = container.get<IStudentNotificationService>(TYPES.StudentNotificationService);

export interface TokenPayload {
  id: string;
  role: string;
}

export function initSocket(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Chat: online users
  const onlineUsers = new Map<string, string>(); // userId -> socketId
  const broadcastOnlineUsers = () => {
    const users = Array.from(onlineUsers.keys());
    io.emit("onlineUsers", users);
  };

  io.on("connection", (socket: Socket) => {
    console.log(`New socket connected: ${socket.id}`);

    /** ------------------- CHAT ------------------- **/

    socket.on("join", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      broadcastOnlineUsers();
    });

    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("send_message", async (data: { senderId: string; receiverId?: string; message: string; chatId: string; senderType: string; receiverType?: string }) => {
      // Save to DB
      const savedMessage = await chatService.sendMessage(data.senderId, data.message, data.chatId, data.senderType, data.receiverId, data.receiverType);

      // Group Chat Broadcast (Room based)
      io.to(data.chatId).emit("receive_message", savedMessage);

      // Direct Message Fallback (for online users not in room - mostly for retro-compatibility or notifications)
      if (data.receiverId) {
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          const receiverSocket = io.sockets.sockets.get(receiverSocketId);
          if (!receiverSocket?.rooms.has(data.chatId)) {
            io.to(receiverSocketId).emit("receive_message", savedMessage);
          }
        }
      }
    });

    socket.on("typing", (data: { senderId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit("typing", { senderId: data.senderId });
    });

    socket.on("read_message", async (data: { chatId: string; messageId: string; senderId: string; receiverId: string }) => {
      try {
        await chatService.markMessageAsRead(data.chatId, data.messageId);
        const senderSocketId = onlineUsers.get(data.senderId);
        if (senderSocketId) io.to(data.chatId).emit("message_read", { messageId: data.messageId, chatId: data.chatId });
      } catch (err) {
        logger.error("Error marking message as read:", err);
      }
    });

    socket.on("react_message", async (data: { chatId: string; messageId: string; userId: string; reaction: string; receiverId: string }) => {
      try {
        await chatService.addReaction(data.chatId, data.messageId, data.userId, data.reaction);
        io.to(data.chatId).emit("message_reaction", data);
      } catch (err) {
        logger.error("Error adding reaction:", err);
      }
    });

    socket.on("delete_message", async (data: { chatId: string; messageId: string; senderId: string; receiverId: string }) => {
      try {
        await chatService.deleteMessage(data.chatId, data.messageId, data.senderId);
        io.to(data.chatId).emit("message_deleted", { messageId: data.messageId, chatId: data.chatId });
      } catch (err) {
        logger.error("Error deleting message:", err);
      }
    });

    socket.on("edit_message", async (data: { chatId: string; messageId: string; senderId: string; newMessage: string; receiverId: string }) => {
      try {
        await chatService.editMessage(data.chatId, data.messageId, data.senderId, data.newMessage);
        io.to(data.chatId).emit("message_edited", { messageId: data.messageId, chatId: data.chatId, newMessage: data.newMessage });
      } catch (err) {
        logger.error("Error editing message:", err);
      }
    });

    socket.on("send_notification", async (data: { receiverId: string; title: string; message: string }) => {
      try {
        console.log("here the notification event on in ", data)
        await notificationService.createNotification(data.receiverId, data.title, data.message, "general");
        const receiverSocketId = onlineUsers.get(data.receiverId);
        console.log("now onwanrd student will get the notification")
        if (receiverSocketId) io.to(receiverSocketId).emit("receive_notification", data);
      } catch (err) {
        logger.error("Error sending notification:", err);
      }
    });

    /** ------------------- VIDEO CALL ------------------- **/

    socket.on("join-room", (roomId: string, userType: "teacher" | "student") => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const clientsInRoom = room?.size || 0;
      const existingUserTypes = Array.from(room?.values() || []).map(id => {
        const socket = io.sockets.sockets.get(id);
        return socket?.data?.userType;
      });

      // Allow only one teacher and one student per room
      if (clientsInRoom >= 2 || (clientsInRoom === 1 && existingUserTypes[0] === userType)) {
        socket.emit("room-full");
        return;
      }

      socket.data.userType = userType;
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", { userId: socket.id, userType });
      console.log(`User ${socket.id} (${userType}) joined room ${roomId}`);

      // WebRTC signaling
      socket.on("offer", (offer, targetId) => {
        console.log(`Relaying offer from ${socket.id} to ${targetId}`);
        socket.to(targetId).emit("offer", offer, socket.id);
      });
      socket.on("answer", (answer, targetId) => {
        console.log(`Relaying answer from ${socket.id} to ${targetId}`);
        socket.to(targetId).emit("answer", answer, socket.id);
      });
      socket.on("ice-candidate", (candidate, targetId) => {
        console.log(`Relaying ICE candidate from ${socket.id} to ${targetId}`);
        socket.to(targetId).emit("ice-candidate", candidate, socket.id);
      });
    });

    /** ------------------- DISCONNECT ------------------- **/

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) onlineUsers.delete(key);
      });
      broadcastOnlineUsers();

      // Notify rooms for video call
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit("user-disconnected", { userId: socket.id });
        }
      });
    });
  });

  // Periodically broadcast online users every 10 seconds
  setInterval(broadcastOnlineUsers, 10000);

  return io;
}