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
    paymentOrderId: { type: String },
    date: { type: String, required: true },
    day: { type: String, required: true },
    slot: { type: timeSlotSchema, required: true },
    note: { type: String, default: '' },
    callId: { type: String },
    rejectionReason: { type: String },
    cancellationReason: { type: String },
    rescheduledFrom: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking' },
    rescheduledTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking' },
    rescheduledReason: { type: String },
    rescheduledAt: { type: Date },
    expireAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) },
    status: {
        type: String,
        enum: ['pending', 'booked', 'cancelled', 'rescheduled', 'failed'],
        default: 'pending',
    },
    rescheduleStatus: {
        type: String,
        enum: ['none', 'requested', 'approved', 'rejected'],
        default: 'none'
    },
    requestedDate: { type: String },
    requestedSlot: {
        start: { type: String },
        end: { type: String }
    }
}, { timestamps: true });
bookingSchema.index({ teacherId: 1, date: 1, 'slot.start': 1, 'slot.end': 1 }, { unique: true, partialFilterExpression: { status: { $in: ['pending', 'booked', 'rescheduled'] } } });
bookingSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { status: 'pending' } });
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
