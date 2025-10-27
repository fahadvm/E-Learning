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
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    // Chat: online users
    const onlineUsers = new Map(); // userId -> socketId
    const broadcastOnlineUsers = () => {
        const users = Array.from(onlineUsers.keys());
        io.emit("onlineUsers", users);
    };
    io.on("connection", (socket) => {
        console.log(`New socket connected: ${socket.id}`);
        /** ------------------- CHAT ------------------- **/
        socket.on("join", (userId) => {
            onlineUsers.set(userId, socket.id);
            broadcastOnlineUsers();
        });
        socket.on("send_message", (data) => __awaiter(this, void 0, void 0, function* () {
            const receiverSocketId = onlineUsers.get(data.receiverId);
            const messageData = Object.assign(Object.assign({}, data), { read: false, createdAt: new Date(), reactions: [] });
            yield chatService.sendMessage(data.senderId, data.receiverId, data.message, data.chatId);
            if (receiverSocketId)
                io.to(receiverSocketId).emit("receive_message", messageData);
        }));
        socket.on("typing", (data) => {
            const receiverSocketId = onlineUsers.get(data.receiverId);
            if (receiverSocketId)
                io.to(receiverSocketId).emit("typing", { senderId: data.senderId });
        });
        socket.on("read_message", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chatService.markMessageAsRead(data.chatId, data.messageId);
                const senderSocketId = onlineUsers.get(data.senderId);
                if (senderSocketId)
                    io.to(senderSocketId).emit("message_read", { messageId: data.messageId, chatId: data.chatId });
            }
            catch (err) {
                logger_1.default.error("Error marking message as read:", err);
            }
        }));
        socket.on("react_message", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chatService.addReaction(data.chatId, data.messageId, data.userId, data.reaction);
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId)
                    io.to(receiverSocketId).emit("message_reaction", data);
            }
            catch (err) {
                logger_1.default.error("Error adding reaction:", err);
            }
        }));
        socket.on("delete_message", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chatService.deleteMessage(data.chatId, data.messageId, data.senderId);
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId)
                    io.to(receiverSocketId).emit("message_deleted", { messageId: data.messageId, chatId: data.chatId });
            }
            catch (err) {
                logger_1.default.error("Error deleting message:", err);
            }
        }));
        socket.on("edit_message", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chatService.editMessage(data.chatId, data.messageId, data.senderId, data.newMessage);
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId)
                    io.to(receiverSocketId).emit("message_edited", { messageId: data.messageId, chatId: data.chatId, newMessage: data.newMessage });
            }
            catch (err) {
                logger_1.default.error("Error editing message:", err);
            }
        }));
        socket.on("send_notification", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield notificationService.createNotification(data.receiverId, data.title, data.message, "general");
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId)
                    io.to(receiverSocketId).emit("receive_notification", data);
            }
            catch (err) {
                logger_1.default.error("Error sending notification:", err);
            }
        }));
        /** ------------------- VIDEO CALL ------------------- **/
        socket.on("join-room", (roomId, userType) => {
            var _a;
            const clientsInRoom = ((_a = io.sockets.adapter.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.size) || 0;
            if (clientsInRoom >= 2) {
                socket.emit("room-full");
                return;
            }
            socket.join(roomId);
            socket.to(roomId).emit("user-connected", { userId: socket.id, userType });
            // WebRTC signaling
            socket.on("offer", (offer, targetId) => socket.to(targetId).emit("offer", offer, socket.id));
            socket.on("answer", (answer, targetId) => socket.to(targetId).emit("answer", answer, socket.id));
            socket.on("ice-candidate", (candidate, targetId) => socket.to(targetId).emit("ice-candidate", candidate, socket.id));
        });
        /** ------------------- DISCONNECT ------------------- **/
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
            onlineUsers.forEach((value, key) => { if (value === socket.id)
                onlineUsers.delete(key); });
            broadcastOnlineUsers();
            // Notify rooms for video call
            socket.rooms.forEach((room) => {
                if (room !== socket.id)
                    socket.to(room).emit("user-disconnected", socket.id);
            });
        });
    });
    // Periodically broadcast online users every 10 seconds
    setInterval(broadcastOnlineUsers, 10000);
    return io;
}
