"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
// Mongoose Schema
const conversationSchema = new mongoose_1.Schema({
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: String },
    lastMessageTime: { type: Date },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    },
}, { timestamps: true });
exports.ConversationModel = (0, mongoose_1.model)('Conversation', conversationSchema);
