"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
const chatController = container_1.default.get(types_1.TYPES.ChatController);
router.get('/messages/:chatId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(chatController.getMessages.bind(chatController)));
router.get('/:chatId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(chatController.getChatDetails.bind(chatController)));
router.get('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(chatController.getUserChats.bind(chatController)));
router.post('/start', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(chatController.startChat.bind(chatController)));
exports.default = router;
