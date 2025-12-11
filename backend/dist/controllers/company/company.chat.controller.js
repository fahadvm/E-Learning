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
exports.CompanyChatController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let CompanyChatController = class CompanyChatController {
    constructor(_companyChatService, _chatService) {
        this._companyChatService = _companyChatService;
        this._chatService = _chatService;
        this.getCompanyGroup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const companyId = req.params.companyId;
                // In a real app, I should verify if the requester (Company Admin or Employee) belongs to this company.
                // Assuming middleware handles auth/role check.
                const group = yield this._companyChatService.getCompanyGroup(companyId);
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, "Company group fetched", true, group);
            }
            catch (error) {
                next(error);
            }
        });
        this.getGroupMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = req.params.chatId;
                const messages = yield this._chatService.getMessages(chatId, 50, new Date().toISOString());
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, "Messages fetched successfully", true, messages);
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.CompanyChatController = CompanyChatController;
exports.CompanyChatController = CompanyChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyChatService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ChatService)),
    __metadata("design:paramtypes", [Object, Object])
], CompanyChatController);
