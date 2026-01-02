"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentBookingService = void 0;
// src/services/student/student.booking.service.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const student_booking_dto_1 = require("../../core/dtos/student/student.booking.dto");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const mongoose_1 = require("mongoose");
const dayjs_1 = __importDefault(require("dayjs"));
const razorpay_1 = __importDefault(require("razorpay"));
let StudentBookingService = class StudentBookingService {
    constructor(_bookingRepo, _availibilityRepo, _notificationRepo, _transactionRepo, _walletRepo) {
        this._bookingRepo = _bookingRepo;
        this._availibilityRepo = _availibilityRepo;
        this._notificationRepo = _notificationRepo;
        this._transactionRepo = _transactionRepo;
        this._walletRepo = _walletRepo;
        this._razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    getAvailability(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!teacherId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const availability = yield this._bookingRepo.getAvailability(teacherId);
            return (0, student_booking_dto_1.bookingsDto)(availability);
        });
    }
    lockingSlot(studentId, teacherId, courseId, date, day, startTime, endTime, note) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (!teacherId || !courseId || !date || !day || !startTime || !endTime)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const studentIdObj = new mongoose_1.Types.ObjectId(studentId);
            const teacherIdObj = new mongoose_1.Types.ObjectId(teacherId);
            const courseIdObj = new mongoose_1.Types.ObjectId(courseId);
            const conflict = yield this._bookingRepo.findConflictingSlot(teacherId, date, startTime, endTime);
            if (conflict)
                (0, ResANDError_1.throwError)('Slot already locked or booked', HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const booking = yield this._bookingRepo.createBooking({
                studentId: studentIdObj,
                teacherId: teacherIdObj,
                courseId: courseIdObj,
                date,
                day,
                slot: {
                    start: startTime,
                    end: endTime,
                },
                note,
                status: 'pending',
            });
            return (0, student_booking_dto_1.bookingDto)(booking);
        });
    }
    cancelBooking(bookingId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookingId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const cancelled = yield this._bookingRepo.updateBookingStatus(bookingId, 'booked', reason);
            if (!cancelled)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.BOOKING_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, student_booking_dto_1.bookingDto)(cancelled);
        });
    }
    approveReschedule(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookingId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const approved = yield this._bookingRepo.approveReschedule(bookingId);
            if (!approved)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.BOOKING_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, student_booking_dto_1.bookingDto)(approved);
        });
    }
    initiatePayment(bookingId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookingId || !amount)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const options = {
                amount: amount * 100,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                notes: { bookingId },
            };
            const razorpayOrder = yield this._razorpay.orders.create(options);
            const updated = yield this._bookingRepo.updateBookingOrderId(bookingId, razorpayOrder.id);
            return { razorpayOrderId: razorpayOrder.id, booking: updated };
        });
    }
    verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const crypto = yield Promise.resolve().then(() => __importStar(require('crypto')));
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');
            if (expectedSignature !== razorpay_signature)
                (0, ResANDError_1.throwError)('Payment verification failed', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const callId = crypto.randomBytes(4).toString('hex');
            const updated = yield this._bookingRepo.verifyAndMarkPaid(razorpay_order_id, callId);
            if (updated) {
                yield this._notificationRepo.createNotification(updated.teacherId.toString(), 'New Booking Confirmed!', ' booked a paid session for .', 'booking', 'teacher');
                // --- Transaction Logic ---
                // Hardcoding default booking price/commission for now if not in Booking model
                // Usually booking amount is determined at initiatePayment. 
                // Assuming a standard fee or we should have stored amount in Booking.
                // Booking model DOES NOT have amount. 
                // `initiatePayment` took `amount`.
                // We rely on external tracking or assumption here.
                // Requirement says "₹100 per booking" (assumed from user prompt or logic).
                // Prompt said: "Video Call Bookings (₹100 per booking)".
                const BOOKING_AMOUNT = 100; // Fixed for now based on prompt
                const COMMISSION_RATE = 0.2; // 20%
                const platformFee = BOOKING_AMOUNT * COMMISSION_RATE;
                const teacherShare = BOOKING_AMOUNT - platformFee;
                // 1. Transaction: Student Paid (MEETING_BOOKING)
                // Transaction model has `meetingId`. Using that for bookingId.
                yield this._transactionRepo.create({
                    userId: updated.studentId,
                    meetingId: updated._id,
                    type: 'MEETING_BOOKING',
                    txnNature: 'CREDIT', // Money credited TO SYSTEM (from student)
                    amount: BOOKING_AMOUNT,
                    grossAmount: BOOKING_AMOUNT,
                    teacherShare,
                    platformFee,
                    paymentMethod: 'RAZORPAY',
                    paymentStatus: 'SUCCESS',
                    notes: `Booking Payment: ${updated._id}`
                });
                // 2. Transaction: Teacher Earning (TEACHER_EARNING)
                const earningTx = yield this._transactionRepo.create({
                    teacherId: updated.teacherId,
                    meetingId: updated._id,
                    type: 'TEACHER_EARNING',
                    txnNature: 'CREDIT',
                    amount: teacherShare,
                    grossAmount: BOOKING_AMOUNT,
                    teacherShare,
                    platformFee,
                    paymentMethod: 'WALLET',
                    paymentStatus: 'SUCCESS',
                    notes: `Earning from Booking: ${updated._id}`
                });
                // Credit Wallet
                yield this._walletRepo.creditTeacherWallet({
                    teacherId: updated.teacherId,
                    amount: teacherShare,
                    transactionId: earningTx._id
                });
            }
            return updated;
        });
    }
    getHistory(studentId, page, limit, status, teacher) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const history = yield this._bookingRepo.getBookingsByStudent(studentId, page, limit, status, teacher);
            return history;
        });
    }
    getScheduledCalls(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const scheduledCalls = yield this._bookingRepo.getScheduledCalls(studentId);
            return scheduledCalls;
        });
    }
    getBookingDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield this._bookingRepo.findById(bookingId);
            if (!details)
                throw new Error('Booking not found');
            return details;
        });
    }
    getBookingDetailsByPaymentId(paymentOrderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield this._bookingRepo.findByPaymentId(paymentOrderId);
            if (!details)
                throw new Error('Booking not found');
            return details;
        });
    }
    getAvailableSlots(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const availability = yield this._availibilityRepo.getAvailabilityByTeacherId(teacherId);
            if (!availability)
                return [];
            const today = (0, dayjs_1.default)();
            const nextWeek = today.add(7, 'day');
            const slotsForWeek = [];
            for (let d = 0; d < 7; d++) {
                const currentDate = today.add(d, 'day');
                const dayName = currentDate.format('dddd');
                const dayAvailability = availability.week.find(w => w.day === dayName && w.enabled);
                if (!dayAvailability)
                    continue;
                for (const slot of dayAvailability.slots) {
                    const slotStart = (0, dayjs_1.default)(`${currentDate.format('YYYY-MM-DD')}T${slot.start}`);
                    slotsForWeek.push({
                        date: currentDate.format('YYYY-MM-DD'),
                        day: dayName,
                        start: slot.start,
                        end: slot.end,
                        slot: slotStart.toDate(),
                    });
                }
            }
            // fetch bookings for next 7 days
            const bookings = yield this._bookingRepo.findBookedSlots(teacherId, today.format('YYYY-MM-DD'), nextWeek.format('YYYY-MM-DD'));
            // convert booked slots into ISO strings
            const bookedSlots = new Set(bookings.map(b => (0, dayjs_1.default)(`${b.date}T${b.slot.start}`).toISOString()));
            // filter out already booked slots
            const availableSlots = slotsForWeek.filter(s => !bookedSlots.has((0, dayjs_1.default)(s.slot).toISOString()));
            // remove duplicates
            const uniqueSlots = Array.from(new Map(availableSlots.map(s => [`${s.date}-${s.start}-${s.end}`, s])).values());
            return uniqueSlots;
        });
    }
};
exports.StudentBookingService = StudentBookingService;
exports.StudentBookingService = StudentBookingService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TeacherAvailabilityRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.NotificationRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.TransactionRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.WalletRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], StudentBookingService);
