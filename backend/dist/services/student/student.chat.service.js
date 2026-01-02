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
    constructor(_chatRepository, _orderRepo) {
        this._chatRepository = _chatRepository;
        this._orderRepo = _orderRepo;
    }
    sendMessage(senderId, message, chatId, senderType, receiverId, receiverType, fileUrl, messageType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!senderId || !chatId || !message)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING);
            return this._chatRepository.saveMessage(senderId, message, chatId, senderType, receiverId, receiverType, fileUrl, messageType);
        });
    }
    getMessages(chatId, limit, before) {
        return __awaiter(this, void 0, void 0, function* () {
            const beforeDate = new Date(before);
            return this._chatRepository.getStudentMessages(chatId, limit, beforeDate);
        });
    }
    getChatDetails(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._chatRepository.getChatDetails(chatId);
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this._chatRepository.getStudentChats(userId);
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
            if (!senderId || !chatId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED);
            const deleted = yield message_1.Message.findByIdAndDelete(messageId);
            if (!deleted)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.MESSAGE_EDIT_FAILED);
        });
    }
    editMessage(chatId, messageId, senderId, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!senderId || !chatId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED);
            const edit = yield message_1.Message.findByIdAndUpdate(messageId, { $set: { message: newMessage, edited: true } });
            if (!edit)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.MESSAGE_EDIT_FAILED);
        });
    }
    getTeachersFromPurchases(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1) Fetch orders populated with courses → teacher
            const enrollments = yield this._orderRepo.getOrdersByStudentId(studentId);
            const teacherMap = new Map();
            const purchasedCourses = [];
            for (const order of enrollments) {
                if (!order.courses || order.courses.length === 0)
                    continue;
                for (const courseItem of order.courses) {
                    if (!courseItem)
                        continue;
                    const course = courseItem;
                    purchasedCourses.push(course);
                    const teacher = course.teacherId;
                    if (!teacher)
                        continue;
                    const tid = String(teacher._id);
                    if (!teacherMap.has(tid)) {
                        teacherMap.set(tid, {
                            _id: tid,
                            name: teacher.name,
                            profilePicture: teacher.profilePicture,
                            about: teacher.about,
                            courseCount: 1,
                        });
                    }
                    else {
                        teacherMap.get(tid).courseCount++;
                    }
                }
            }
            // 3) Check chat threads
            const chats = yield this._chatRepository.getStudentChats(studentId);
            const chatTeacherIds = new Set(chats.map((c) => String(c.teacherId)));
            // 4) Final teachers array
            const teachers = Array.from(teacherMap.values()).map((t) => (Object.assign(Object.assign({}, t), { hasChat: chatTeacherIds.has(t._id) })));
            // 5) Return teachers + purchased courses
            return {
                teachers,
                courses: purchasedCourses,
            };
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ChatRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OrderRepository)),
    __metadata("design:paramtypes", [Object, Object])
], ChatService);
