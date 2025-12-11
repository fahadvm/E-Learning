"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
// Mongoose Schema
const chatSchema = new mongoose_1.Schema({
    participants: [
        { type: mongoose_1.Schema.Types.ObjectId, refPath: 'participantModel' }
    ],
    // For specific chat types
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student' },
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Teacher' },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    type: { type: String, enum: ['direct', 'group'], default: 'direct' },
    groupName: { type: String },
    groupPhoto: { type: String },
    isActive: { type: Boolean, default: true },
    lastMessage: { type: String },
}, { timestamps: true });
exports.Chat = (0, mongoose_1.model)('Chat', chatSchema);
