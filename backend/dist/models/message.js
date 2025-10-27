"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const reactionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    reaction: { type: String, required: true },
}, { _id: false });
const messageSchema = new mongoose_1.Schema({
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    fileUrl: { type: String },
    isRead: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
    reaction: [reactionSchema],
}, {
    timestamps: true,
    versionKey: false,
});
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
