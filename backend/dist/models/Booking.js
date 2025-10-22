"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const timeSlotSchema = new mongoose_1.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
}, { _id: false });
const bookingSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    paymentOrderId: { type: String, },
    date: { type: String, required: true },
    day: { type: String, required: true },
    rejectionReason: { type: String, required: false },
    cancellationReason: { type: String, required: false },
    slot: { type: timeSlotSchema, required: true },
    note: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'approved', 'paid', 'cancelled', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
