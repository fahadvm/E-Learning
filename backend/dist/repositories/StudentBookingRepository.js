"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.StudentBookingRepository = void 0;
const inversify_1 = require("inversify");
const Booking_1 = require("../models/Booking");
const mongoose_1 = require("mongoose");
const ResANDError_1 = require("../utils/ResANDError");
const ResponseMessages_1 = require("../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../utils/HttpStatuscodes");
let StudentBookingRepository = class StudentBookingRepository {
    getAvailability(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Booking_1.Booking.find({ teacherId: new mongoose_1.Types.ObjectId(teacherId) });
        });
    }
    getScheduledCalls(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date().toISOString().split('T')[0];
            return Booking_1.Booking.find({
                studentId,
                status: 'booked',
                date: { $gte: today }
            })
                .populate('teacherId', 'name email profilePicture')
                .populate('courseId', 'title')
                .sort({ date: 1 });
        });
    }
    createBooking(booking) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBooking = new Booking_1.Booking(booking);
            return yield newBooking.save();
        });
    }
    findByTeacherDateSlot(teacherId, date, slot) {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.findOne({
                teacherId,
                date,
                'slot.start': slot.start,
                'slot.end': slot.end,
                status: { $in: ['booked', 'cancelled', 'rescheduled'] },
            }).populate({
                path: 'studentId',
                select: 'name email',
            })
                .populate({
                path: 'courseId',
                select: 'title',
            });
        });
    }
    updateBookingStatus(bookingId, status, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = status === 'cancelled' && reason
                ? { status, cancellationReason: reason }
                : { status };
            return yield Booking_1.Booking.findByIdAndUpdate(bookingId, updateData, { new: true })
                .populate('studentId teacherId courseId');
        });
    }
    getBookingsByStudent(studentId, page, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { studentId };
            if (status)
                query.status = status;
            const skip = (page - 1) * limit;
            const [data, total] = yield Promise.all([
                Booking_1.Booking.find(query)
                    .populate('teacherId')
                    .populate('courseId')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Booking_1.Booking.countDocuments(query),
            ]);
            return {
                data,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            };
        });
    }
    findBookedSlots(teacherId, today, nextWeek) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Booking_1.Booking.find({
                teacherId,
                date: { $gte: today, $lte: nextWeek },
                status: { $in: ['pending', 'booked', 'rescheduled'] }
            }).lean();
        });
    }
    findPending(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [requests, totalCount] = yield Promise.all([
                Booking_1.Booking.find({ status: 'pending' })
                    .populate('studentId', 'name profilePicture')
                    .populate('courseId', 'title')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Booking_1.Booking.countDocuments({ status: 'pending' }),
            ]);
            return {
                requests,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
            };
        });
    }
    findConfirmed() {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.find({ status: 'confirmed' }).populate('studentId teacherId');
        });
    }
    findById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.findById(bookingId).populate('studentId courseId teacherId');
        });
    }
    findByPaymentId(paymentOrderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.findOne({ paymentOrderId })
                .populate('courseId')
                .populate('teacherId').lean().exec();
        });
    }
    rejectBooking(bookingId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.findByIdAndUpdate(bookingId, { status: 'rejected', rejectionReason: reason }, { new: true });
        });
    }
    updateBookingOrderId(bookingId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Booking_1.Booking.findByIdAndUpdate(bookingId, { paymentOrderId: orderId }, { new: true });
        });
    }
    findByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Booking_1.Booking.findOne({ paymentOrderId: orderId });
        });
    }
    verifyAndMarkPaid(orderId, callId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paidBooking = yield Booking_1.Booking.findOneAndUpdate({ paymentOrderId: orderId }, { status: 'booked', callId }, { new: true });
            if (!paidBooking)
                return null;
            yield Booking_1.Booking.updateMany({
                _id: { $ne: paidBooking._id },
                teacherId: paidBooking.teacherId,
                date: paidBooking.date,
                'slot.start': paidBooking.slot.start,
                'slot.end': paidBooking.slot.end,
                status: 'pending'
            }, {
                $set: {
                    status: 'cancelled',
                    cancellationReason: 'Slot booked by someone else'
                }
            });
            return paidBooking;
        });
    }
    getHistory(filter, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.find(filter)
                .populate('studentId', 'name email')
                .populate('courseId', 'title')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        });
    }
    countHistory(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.countDocuments(filter);
        });
    }
    rescheduleBooking(bookingId, reason, nextSlot) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBooking = yield Booking_1.Booking.findById(bookingId);
            if (!oldBooking)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.BOOKING_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const newBooking = yield Booking_1.Booking.create({
                teacherId: oldBooking.teacherId,
                studentId: oldBooking.studentId,
                courseId: oldBooking.courseId,
                note: oldBooking.note,
                callId: oldBooking.callId,
                paymentOrderId: oldBooking.paymentOrderId,
                day: nextSlot.day,
                date: nextSlot.date,
                slot: {
                    start: nextSlot.start,
                    end: nextSlot.end,
                },
                status: 'booked',
                rescheduledFrom: oldBooking._id,
            });
            yield Booking_1.Booking.findByIdAndUpdate(oldBooking._id, {
                status: 'rescheduled',
                rescheduledTo: newBooking._id,
                rescheduledReason: reason,
                rescheduledAt: new Date(),
            });
            return newBooking;
        });
    }
    findConflictingSlot(teacherId, date, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Booking_1.Booking.findOne({
                teacherId,
                date,
                status: { $in: ['pending', 'booked', 'rescheduled'] },
                $or: [
                    {
                        'slot.start': { $lt: endTime },
                        'slot.end': { $gt: startTime }
                    }
                ]
            });
        });
    }
    requestReschedule(bookingId, reason, nextSlot) {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.findByIdAndUpdate(bookingId, {
                requestedDate: nextSlot.date,
                requestedSlot: {
                    start: nextSlot.start,
                    end: nextSlot.end
                },
                rescheduledReason: reason,
                rescheduleStatus: 'requested'
            }, { new: true });
        });
    }
    approveReschedule(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBooking = yield Booking_1.Booking.findById(bookingId);
            if (!oldBooking)
                (0, ResANDError_1.throwError)('Booking not found.', HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (oldBooking.rescheduleStatus !== 'requested') {
                (0, ResANDError_1.throwError)('No pending reschedule request.', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const newBooking = yield Booking_1.Booking.create({
                studentId: oldBooking.studentId,
                teacherId: oldBooking.teacherId,
                courseId: oldBooking.courseId,
                date: oldBooking.requestedDate,
                day: oldBooking.day,
                slot: oldBooking.requestedSlot,
                note: oldBooking.note,
                callId: oldBooking.callId,
                status: 'booked',
                rescheduledFrom: oldBooking._id,
            });
            oldBooking.status = 'rescheduled';
            oldBooking.rescheduleStatus = 'approved';
            oldBooking.rescheduledTo = newBooking._id;
            oldBooking.rescheduledAt = new Date();
            oldBooking.requestedDate = undefined;
            oldBooking.requestedSlot = undefined;
            yield oldBooking.save();
            return newBooking;
        });
    }
    rejectReschedule(bookingId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return Booking_1.Booking.findByIdAndUpdate(bookingId, {
                rescheduleStatus: 'rejected',
                rejectionReason: reason,
                $unset: {
                    requestedDate: 1,
                    requestedSlot: 1
                }
            }, { new: true });
        });
    }
};
exports.StudentBookingRepository = StudentBookingRepository;
exports.StudentBookingRepository = StudentBookingRepository = __decorate([
    (0, inversify_1.injectable)()
], StudentBookingRepository);
