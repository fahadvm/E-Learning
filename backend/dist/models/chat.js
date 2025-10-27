"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    participants: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
    ],
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastMessage: { type: String },
}, { timestamps: true });
exports.Chat = (0, mongoose_1.model)('Chat', chatSchema);
