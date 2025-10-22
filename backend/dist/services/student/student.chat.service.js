"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.ChatService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const message_1 = require("../../models/message"); // Adjust path
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let ChatService = class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    sendMessage(senderId, receiverId, message, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!senderId || !chatId || !message || !receiverId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING);
            return this.chatRepository.saveMessage(senderId, receiverId, message);
        });
    }
    getMessages(chatId, limit, before) {
        return __awaiter(this, void 0, void 0, function* () {
            let beforeDate = new Date(before);
            return this.chatRepository.getStudentMessages(chatId, limit, beforeDate);
        });
    }
    getChatDetails(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatRepository.getChatDetails(chatId);
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.chatRepository.getStudentChats(userId);
            return chat;
        });
    }
    // markMessageAsRead(chatId: string, messageId: string): Promise<IMessage>;
    //   addReaction(chatId: string, messageId: string, userId: string, reaction: string): Promise<IMessage>;
    addReaction(chatId, messageId, userId, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield message_1.Message.updateOne({ _id: messageId, chatId }, { $push: { reactions: { userId, reaction } } });
        });
    }
    markMessageAsRead(chatId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield message_1.Message.updateOne({ _id: messageId, chatId }, { $set: { isRead: true } });
        });
    }
    deleteMessage(chatId, messageId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!senderId || chatId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED);
            yield message_1.Message.findByIdAndDelete(messageId);
        });
    }
    editMessage(chatId, messageId, senderId, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!senderId || chatId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED);
            yield message_1.Message.findByIdAndUpdate(messageId, { $set: { message: newMessage, edited: true } });
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ChatRepository)),
    __metadata("design:paramtypes", [Object])
], ChatService);
