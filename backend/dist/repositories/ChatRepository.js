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
            // Convert string IDs to ObjectId
            const participantIds = participants.map(id => new mongoose_1.Types.ObjectId(id));
            const chat = yield chat_1.Chat.findOne({ participants: { $all: participantIds } });
            // console.log("found one of most chat i got ",chat)
            if (chat)
                return chat;
            const newChat = yield chat_1.Chat.create({ participants: participantIds });
            return newChat;
        });
    }
    saveMessage(senderId, receiverId, content, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("here the saving message with :",senderId,receiverId)
            const chat = yield this.findOrCreateChat([senderId, receiverId]);
            // console.log("founded chat is" ,chat )
            const message = yield message_1.Message.create({
                chatId: chat._id,
                senderId: new mongoose_1.Types.ObjectId(senderId),
                receiverId: new mongoose_1.Types.ObjectId(receiverId),
                message: content, // Updated to match schema
            });
            console.log("chat id from repo for last seen", chatId);
            yield chat_1.Chat.findByIdAndUpdate(chatId, { lastMessage: content });
            return message;
        });
    }
    getStudentMessages(chatId, limit, before) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { chatId: new mongoose_1.Types.ObjectId(chatId) };
            if (before) {
                query.createdAt = { $lt: before };
            }
            return message_1.Message.find({ chatId: new mongoose_1.Types.ObjectId(chatId) }).populate('receiverId', 'name email profilePicture').sort({ createdAt: 1 });
        });
    }
    getTeacherMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return message_1.Message.find({ chatId: new mongoose_1.Types.ObjectId(chatId) }).populate('receiverId', 'name email profilePicture').sort({ createdAt: 1 });
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
            return chat_1.Chat.find({ studentId: new mongoose_1.Types.ObjectId(userId) }).populate('teacherId', 'name email profilePicture');
        });
    }
    getTeacherChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chat_1.Chat.find({ teacherId: new mongoose_1.Types.ObjectId(userId) }).populate('studentId', 'name email profilePicture');
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, inversify_1.injectable)()
], ChatRepository);
