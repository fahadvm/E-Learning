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
exports.ChatController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const chat_1 = require("../../models/chat");
let ChatController = class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
        this.getMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { chatId } = req.params;
            const limit = parseInt(req.query.limit) || 20;
            const before = req.query.before;
            const messages = yield this._chatService.getMessages(chatId, limit, before);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSE_DETAILS_FETCHED, true, messages);
        });
        this.getChatDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { chatId } = req.params;
            const details = yield this._chatService.getChatDetails(chatId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSE_DETAILS_FETCHED, true, details);
        });
        this.getUserChats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
            const chats = yield this._chatService.getUserChats(userId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CHAT_LIST_FETCHED, true, chats);
        });
        this.startChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { studentId, teacherId } = req.body;
            let chat = yield chat_1.Chat.findOne({
                participants: { $all: [studentId, teacherId] },
            });
            if (!chat) {
                chat = yield chat_1.Chat.create({
                    participants: [studentId, teacherId],
                    studentId,
                    teacherId
                });
            }
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CHAT_LIST_FETCHED, true, chat);
        });
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ChatService)),
    __metadata("design:paramtypes", [Object])
], ChatController);
