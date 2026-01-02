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
exports.broadcastEvent = exports.emitToUser = exports.getIO = void 0;
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const container_1 = __importDefault(require("../core/di/container"));
const types_1 = require("../core/di/types");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../utils/logger"));
dotenv_1.default.config();
const chatService = container_1.default.get(types_1.TYPES.ChatService);
const notificationService = container_1.default.get(types_1.TYPES.StudentNotificationService);
let ioInstance;
const getIO = () => ioInstance;
exports.getIO = getIO;
const onlineUsers = new Map(); // userId -> socketId
const emitToUser = (userId, event, data) => {
    if (ioInstance) {
        const socketId = onlineUsers.get(userId);
        if (socketId) {
            ioInstance.to(socketId).emit(event, data);
        }
    }
};
exports.emitToUser = emitToUser;
const broadcastEvent = (event, data) => {
    if (ioInstance) {
        ioInstance.emit(event, data);
    }
};
exports.broadcastEvent = broadcastEvent;
function initSocket(server) {
    const allowedOrigins = [
        'https://devnext.online',
        'https://www.devnext.online',
        'https://api.devnext.online',
        'http://localhost:3000',
    ];
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    ioInstance = io;
    const broadcastOnlineUsers = () => {
        const users = Array.from(onlineUsers.keys());
        io.emit('onlineUsers', users);
    };
    io.on('connection', (socket) => {
        logger_1.default.info(`New socket connected: ${socket.id}`);
        /** ------------------- CHAT ------------------- **/
        socket.on('join', (userId) => {
            onlineUsers.set(userId, socket.id);
            broadcastOnlineUsers();
            logger_1.default.info(`User ${userId} joined with socket ${socket.id}`);
        });
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
            logger_1.default.info(`User ${socket.id} joined chat ${chatId}`);
        });
        socket.on('send_message', (data) => __awaiter(this, void 0, void 0, function* () {
            // Save to DB
            const savedMessage = yield chatService.sendMessage(data.senderId, data.message, data.chatId, data.senderType, data.receiverId, data.receiverType);
            // Group Chat Broadcast (Room based - for those inside the chat)
            io.to(data.chatId).emit('receive_message', savedMessage);
            // Notify Recipient for Chat List Update (move to top)
            if (data.receiverId) {
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId) {
                    // Emit event to update chat list order
                    io.to(receiverSocketId).emit('chat-list-update', {
                        chatId: data.chatId,
                        lastMessage: savedMessage,
                    });
                    // Also check if we need to send a direct message fallback if they aren't in the room
                    const receiverSocket = io.sockets.sockets.get(receiverSocketId);
                    if (!(receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.rooms.has(data.chatId))) {
                        // Optional: send notification if needed here
                    }
                }
            }
            // Also update sender's chat list (if they have multiple tabs or just for consistency)
            const senderSocketId = onlineUsers.get(data.senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit('chat-list-update', {
                    chatId: data.chatId,
                    lastMessage: savedMessage,
                });
            }
        }));
        socket.on('typing', (data) => {
            const receiverSocketId = onlineUsers.get(data.receiverId);
            if (receiverSocketId)
                io.to(receiverSocketId).emit('typing', { senderId: data.senderId });
        });
        socket.on('read_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chatService.markMessageAsRead(data.chatId, data.messageId);
                const senderSocketId = onlineUsers.get(data.senderId);
                if (senderSocketId)
                    io.to(data.chatId).emit('message_read', { messageId: data.messageId, chatId: data.chatId });
            }
            catch (err) {
                logger_1.default.error('Error marking message as read:', err);
            }
        }));
        socket.on('react_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chatService.addReaction(data.chatId, data.messageId, data.userId, data.reaction);
                io.to(data.chatId).emit('message_reaction', data);
            }
            catch (err) {
                logger_1.default.error('Error adding reaction:', err);
            }
        }));
        socket.on('delete_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chatService.deleteMessage(data.chatId, data.messageId, data.senderId);
                io.to(data.chatId).emit('message_deleted', { messageId: data.messageId, chatId: data.chatId });
            }
            catch (err) {
                logger_1.default.error('Error deleting message:', err);
            }
        }));
        socket.on('edit_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chatService.editMessage(data.chatId, data.messageId, data.senderId, data.newMessage);
                io.to(data.chatId).emit('message_edited', { messageId: data.messageId, chatId: data.chatId, newMessage: data.newMessage });
            }
            catch (err) {
                logger_1.default.error('Error editing message:', err);
            }
        }));
        socket.on('send_notification', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield notificationService.createNotification(data.receiverId, data.title, data.message, 'general');
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId)
                    io.to(receiverSocketId).emit('receive_notification', data);
            }
            catch (err) {
                logger_1.default.error('Error sending notification:', err);
            }
        }));
        /** ------------------- DIRECT CALLING (WhatsApp Style) ------------------- **/
        // Caller initiates call
        socket.on('call-user', (data) => {
            const receiverSocketId = onlineUsers.get(data.userToCall);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('incoming-call', {
                    signal: data.signalData,
                    from: data.from,
                    name: data.name
                });
            }
        });
        // Receiver answers call
        socket.on('answer-call', (data) => {
            // Robust routing: Try UserID lookup, fallback to direct SocketID
            const targetSocketId = onlineUsers.get(data.to) || data.to;
            if (targetSocketId) {
                io.to(targetSocketId).emit('call-accepted', data.signal);
            }
        });
        // Receiver rejects call
        socket.on('reject-call', (data) => {
            const targetSocketId = onlineUsers.get(data.to) || data.to;
            if (targetSocketId) {
                io.to(targetSocketId).emit('call-rejected');
            }
        });
        // End call
        socket.on('end-call', (data) => {
            const targetSocketId = onlineUsers.get(data.to) || data.to;
            if (targetSocketId) {
                io.to(targetSocketId).emit('call-ended');
            }
        });
        // ICE Candidate Relay (Global)
        socket.on('ice-candidate', (candidate, to) => {
            const targetSocketId = onlineUsers.get(to) || to;
            if (targetSocketId) {
                io.to(targetSocketId).emit('ice-candidate', candidate, socket.id);
            }
        });
        /** ------------------- ROOM VIDEO CALL (Legacy/Backup) ------------------- **/
        socket.on('join-room', (roomId, userType) => {
            const room = io.sockets.adapter.rooms.get(roomId);
            const clientsInRoom = (room === null || room === void 0 ? void 0 : room.size) || 0;
            const existingUserTypes = Array.from((room === null || room === void 0 ? void 0 : room.values()) || []).map(id => {
                var _a;
                const socket = io.sockets.sockets.get(id);
                return (_a = socket === null || socket === void 0 ? void 0 : socket.data) === null || _a === void 0 ? void 0 : _a.userType;
            });
            // Allow only one teacher and one student per room
            if (clientsInRoom >= 2 || (clientsInRoom === 1 && existingUserTypes[0] === userType)) {
                socket.emit('room-full');
                return;
            }
            socket.data.userType = userType;
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', { userId: socket.id, userType });
            logger_1.default.info(`User ${socket.id} (${userType}) joined room ${roomId}`);
            // WebRTC signaling
            socket.on('offer', (offer, targetId) => {
                // logger.info(`Relaying offer from ${socket.id} to ${targetId}`);
                socket.to(targetId).emit('offer', offer, socket.id);
            });
            socket.on('answer', (answer, targetId) => {
                // logger.info(`Relaying answer from ${socket.id} to ${targetId}`);
                socket.to(targetId).emit('answer', answer, socket.id);
            });
            socket.on('ice-candidate', (candidate, targetId) => {
                // logger.info(`Relaying ICE candidate from ${socket.id} to ${targetId}`);
                socket.to(targetId).emit('ice-candidate', candidate, socket.id);
            });
        });
        /** ------------------- DISCONNECT ------------------- **/
        socket.on('disconnect', () => {
            // logger.info(`Socket disconnected: ${socket.id}`);
            onlineUsers.forEach((value, key) => {
                if (value === socket.id)
                    onlineUsers.delete(key);
            });
            broadcastOnlineUsers();
            // Notify rooms for video call
            socket.rooms.forEach((room) => {
                if (room !== socket.id) {
                    socket.to(room).emit('call-ended'); // Use unified event
                    socket.to(room).emit('user-disconnected', { userId: socket.id });
                }
            });
        });
    });
    // Periodically broadcast online users every 10 seconds
    setInterval(broadcastOnlineUsers, 10000);
    return io;
}
