"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const inversify_1 = require("inversify");
const chat_1 = require("../models/chat");
const message_1 = require("../models/message");
const mongoose_1 = require("mongoose");
let ChatRepository = class ChatRepository {
    findOrCreateChat(participants) {
        return __awaiter(this, void 0, void 0, function* () {
            const participantIds = participants.map(id => new mongoose_1.Types.ObjectId(id));
            // Check for any direct chat with these participants first
            let chat = yield chat_1.Chat.findOne({ participants: { $all: participantIds, $size: 2 }, type: 'direct' });
            if (chat)
                return chat;
            // Fallback search
            chat = yield chat_1.Chat.findOne({ participants: { $all: participantIds } });
            if (chat)
                return chat;
            const newChat = yield chat_1.Chat.create({ participants: participantIds, type: 'direct' });
            return newChat;
        });
    }
    findOrCreateDirectChat(studentId, teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sId = new mongoose_1.Types.ObjectId(studentId);
            const tId = new mongoose_1.Types.ObjectId(teacherId);
            // Try to find by explicit fields first
            let chat = yield chat_1.Chat.findOne({
                studentId: sId,
                teacherId: tId,
                type: 'direct'
            });
            if (!chat) {
                // Try to find by participants as fallback
                chat = yield chat_1.Chat.findOne({
                    participants: { $all: [sId, tId], $size: 2 },
                    type: 'direct'
                });
            }
            if (chat) {
                // Ensure fields are set if they were missing
                if (!chat.studentId || !chat.teacherId) {
                    chat.studentId = sId;
                    chat.teacherId = tId;
                    yield chat.save();
                }
                return chat;
            }
            // Create new
            const newChat = yield chat_1.Chat.create({
                participants: [sId, tId],
                studentId: sId,
                teacherId: tId,
                type: 'direct'
            });
            return newChat;
        });
    }
    saveMessage(senderId_1, content_1, chatId_1, senderType_1, receiverId_1, receiverType_1, fileUrl_1) {
        return __awaiter(this, arguments, void 0, function* (senderId, content, chatId, senderType, receiverId, receiverType, fileUrl, messageType = 'text') {
            let chat;
            if (chatId) {
                chat = yield chat_1.Chat.findById(chatId);
            }
            else if (receiverId) {
                chat = yield this.findOrCreateChat([senderId, receiverId]);
            }
            if (!chat)
                throw new Error('Chat not found');
            const messageData = {
                chatId: chat._id,
                senderId: new mongoose_1.Types.ObjectId(senderId),
                senderType: senderType,
                message: content,
                type: messageType,
                fileUrl: fileUrl
            };
            if (receiverId) {
                messageData.receiverId = new mongoose_1.Types.ObjectId(receiverId);
                messageData.receiverType = receiverType;
            }
            const messageArray = yield message_1.Message.create([messageData]);
            const message = messageArray[0];
            yield chat_1.Chat.findByIdAndUpdate(chat._id, { lastMessage: content });
            return message;
        });
    }
    getStudentMessages(chatId, limit, before) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { chatId: new mongoose_1.Types.ObjectId(chatId) };
            if (before && !isNaN(before.getTime())) {
                query.createdAt = { $lt: before };
            }
            return message_1.Message.find(query)
                .populate('receiverId', 'name email profilePicture')
                .sort({ createdAt: 1 })
                .limit(limit);
        });
    }
    getTeacherMessages(chatId, limit, before) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { chatId: new mongoose_1.Types.ObjectId(chatId) };
            if (before && !isNaN(before.getTime())) {
                query.createdAt = { $lt: before };
            }
            return message_1.Message.find(query).populate('receiverId', 'name email profilePicture').sort({ createdAt: 1 });
        });
    }
    getChatDetails(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chat_1.Chat.findById(chatId)
                .populate('teacherId', 'name email profilePicture')
                .populate('studentId', 'name email profilePicture');
        });
    }
    getStudentChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield chat_1.Chat.find({ studentId: new mongoose_1.Types.ObjectId(userId) })
                .populate('teacherId', 'name email profilePicture')
                .sort({ updatedAt: -1 })
                .lean();
            const chatsWithUnread = yield Promise.all(chats.map((chat) => __awaiter(this, void 0, void 0, function* () {
                const unread = yield message_1.Message.countDocuments({
                    chatId: chat._id,
                    receiverId: new mongoose_1.Types.ObjectId(userId),
                    isRead: false
                });
                return Object.assign(Object.assign({}, chat), { unread });
            })));
            return chatsWithUnread;
        });
    }
    getTeacherChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield chat_1.Chat.find({ teacherId: new mongoose_1.Types.ObjectId(userId) })
                .populate('studentId', 'name email profilePicture')
                .sort({ updatedAt: -1 })
                .lean();
            const chatsWithUnread = yield Promise.all(chats.map((chat) => __awaiter(this, void 0, void 0, function* () {
                const unread = yield message_1.Message.countDocuments({
                    chatId: chat._id,
                    receiverId: new mongoose_1.Types.ObjectId(userId),
                    isRead: false
                });
                return Object.assign(Object.assign({}, chat), { unread });
            })));
            return chatsWithUnread;
        });
    }
    findOrCreateCompanyGroup(companyId, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            let chat = yield chat_1.Chat.findOne({ companyId: new mongoose_1.Types.ObjectId(companyId), type: 'group' });
            if (!chat) {
                chat = yield chat_1.Chat.create({
                    companyId: new mongoose_1.Types.ObjectId(companyId),
                    type: 'group',
                    groupName: groupName,
                    participants: []
                });
            }
            return chat;
        });
    }
    addParticipantToGroup(chatId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chat_1.Chat.findByIdAndUpdate(chatId, {
                $addToSet: { participants: new mongoose_1.Types.ObjectId(participantId) }
            }, { new: true });
        });
    }
    removeParticipantFromGroup(chatId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chat_1.Chat.findByIdAndUpdate(chatId, {
                $pull: { participants: new mongoose_1.Types.ObjectId(participantId) }
            }, { new: true });
        });
    }
    getCompanyGroupChat(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chat_1.Chat.findOne({ companyId: new mongoose_1.Types.ObjectId(companyId), type: 'group' });
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, inversify_1.injectable)()
], ChatRepository);
