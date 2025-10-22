import { Server, } from 'socket.io';
import container from '../core/di/container';
import { TYPES } from '../core/di/types';
import { Server as HTTPServer } from 'http';
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
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Map to track online users
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  // Broadcast online users to all clients
  const broadcastOnlineUsers = () => {
    const users = Array.from(onlineUsers.keys());
    io.emit('onlineUsers', users);
  };

  io.on('connection', (socket) => {
    logger.info('New socket connected:', socket.id);

    // When user joins with their ID
    socket.on('join', (userId: string) => {
      onlineUsers.set(userId, socket.id);
      logger.info('Online users:', Array.from(onlineUsers.keys()));
      broadcastOnlineUsers(); // Broadcast updated online users
    });

    // Listen for messages
    socket.on('send_message', async (data: { senderId: string; receiverId: string; message: string; chatId: string }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      const messageData = { ...data, read: false, createdAt: new Date(), reactions: [] };
      await chatService.sendMessage(data.senderId, data.receiverId, data.message, data.chatId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', messageData);
      }
    });

    // Listen for typing events
    socket.on('typing', (data: { senderId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { senderId: data.senderId });
      }
    });

    // Listen for read message events
    socket.on('read_message', async (data: { chatId: string; messageId: string; senderId: string; receiverId: string }) => {
      try {
        // Update message read status in the database
        await chatService.markMessageAsRead(data.chatId, data.messageId);
        // Notify the sender that the message was read
        const senderSocketId = onlineUsers.get(data.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_read', { messageId: data.messageId, chatId: data.chatId });
        }
      } catch (err) {
         logger.error('Error marking message as read:', err);
      }
    });

    // Listen for message reaction events
    socket.on('react_message', async (data: { chatId: string; messageId: string; userId: string; reaction: string; receiverId: string }) => {
      try {
        // Update message with reaction in the database
        await chatService.addReaction(data.chatId, data.messageId, data.userId, data.reaction);
        // Notify the receiver of the reaction
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message_reaction', {
            messageId: data.messageId,
            chatId: data.chatId,
            userId: data.userId,
            reaction: data.reaction,
          });
        }
      } catch (err) {
         logger.error('Error adding reaction:', err);
      }
    });

    // Listen for message deletion events
    socket.on('delete_message', async (data: { chatId: string; messageId: string; senderId: string; receiverId: string }) => {
      try {
        // Delete message from the database
        await chatService.deleteMessage(data.chatId, data.messageId, data.senderId);
        // Notify the receiver to remove the message
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message_deleted', { messageId: data.messageId, chatId: data.chatId });
        }
      } catch (err) {
         logger.error('Error deleting message:', err);
      }
    });

    // Listen for message edit events
    socket.on('edit_message', async (data: { chatId: string; messageId: string; senderId: string; newMessage: string; receiverId: string }) => {
      try {
        // Update message content in the database
        await chatService.editMessage(data.chatId, data.messageId, data.senderId, data.newMessage);
        // Notify the receiver of the updated message
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message_edited', {
            messageId: data.messageId,
            chatId: data.chatId,
            newMessage: data.newMessage,
          });
        }
      } catch (err) {
         logger.error('Error editing message:', err);
      }
    });

    socket.on('send_notification', async (data: { receiverId: string; title: string; message: string; }) => {
      try {
        // Update message content in the database
        await notificationService.createNotification(data.receiverId, data.title, data.message, 'general');
        // Notify the receiver of the updated message
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_notification', {
            title: data.title,
            message: data.message,
          });
        }
      } catch (err) {
         logger.error('Error sending  notification:', err);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info('Socket disconnected:', socket.id);
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