"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const container_1 = __importDefault(require("../core/di/container"));
const types_1 = require("../core/di/types");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../utils/logger"));
dotenv_1.default.config();
const chatService = container_1.default.get(types_1.TYPES.ChatService);
const notificationService = container_1.default.get(types_1.TYPES.StudentNotificationService);
function initSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    // Map to track online users
    const onlineUsers = new Map(); // userId -> socketId
    // Broadcast online users to all clients
    const broadcastOnlineUsers = () => {
        const users = Array.from(onlineUsers.keys());
        io.emit('onlineUsers', users);
    };
    io.on('connection', (socket) => {
        logger_1.default.info('New socket connected:', socket.id);
        // When user joins with their ID
        socket.on('join', (userId) => {
            onlineUsers.set(userId, socket.id);
            logger_1.default.info('Online users:', Array.from(onlineUsers.keys()));
            broadcastOnlineUsers(); // Broadcast updated online users
        });
        // Listen for messages
        socket.on('send_message', (data) => __awaiter(this, void 0, void 0, function* () {
            const receiverSocketId = onlineUsers.get(data.receiverId);
            const messageData = Object.assign(Object.assign({}, data), { read: false, createdAt: new Date(), reactions: [] });
            yield chatService.sendMessage(data.senderId, data.receiverId, data.message, data.chatId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_message', messageData);
            }
        }));
        // Listen for typing events
        socket.on('typing', (data) => {
            const receiverSocketId = onlineUsers.get(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing', { senderId: data.senderId });
            }
        });
        // Listen for read message events
        socket.on('read_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Update message read status in the database
                yield chatService.markMessageAsRead(data.chatId, data.messageId);
                // Notify the sender that the message was read
                const senderSocketId = onlineUsers.get(data.senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit('message_read', { messageId: data.messageId, chatId: data.chatId });
                }
            }
            catch (err) {
                logger_1.default.err('Error marking message as read:', err);
            }
        }));
        // Listen for message reaction events
        socket.on('react_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Update message with reaction in the database
                yield chatService.addReaction(data.chatId, data.messageId, data.userId, data.reaction);
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
            }
            catch (err) {
                logger_1.default.err('Error adding reaction:', err);
            }
        }));
        // Listen for message deletion events
        socket.on('delete_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete message from the database
                yield chatService.deleteMessage(data.chatId, data.messageId, data.senderId);
                // Notify the receiver to remove the message
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('message_deleted', { messageId: data.messageId, chatId: data.chatId });
                }
            }
            catch (err) {
                logger_1.default.err('Error deleting message:', err);
            }
        }));
        // Listen for message edit events
        socket.on('edit_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Update message content in the database
                yield chatService.editMessage(data.chatId, data.messageId, data.senderId, data.newMessage);
                // Notify the receiver of the updated message
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('message_edited', {
                        messageId: data.messageId,
                        chatId: data.chatId,
                        newMessage: data.newMessage,
                    });
                }
            }
            catch (err) {
                logger_1.default.err('Error editing message:', err);
            }
        }));
        socket.on('send_notification', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Update message content in the database
                yield notificationService.createNotification(data.receiverId, data.title, data.message, 'general');
                // Notify the receiver of the updated message
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receive_notification', {
                        title: data.title,
                        message: data.message,
                    });
                }
            }
            catch (err) {
                logger_1.default.err('Error sending  notification:', err);
            }
        }));
        // Handle disconnect
        socket.on('disconnect', () => {
            logger_1.default.info('Socket disconnected:', socket.id);
            // Remove from online users
            onlineUsers.forEach((value, key) => {
                if (value === socket.id)
                    onlineUsers.delete(key);
            });
            broadcastOnlineUsers(); // Broadcast updated online users
        });
    });
    // Periodically broadcast online users every 10 seconds
    setInterval(broadcastOnlineUsers, 10000);
}
