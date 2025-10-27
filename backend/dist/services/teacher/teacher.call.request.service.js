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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherCallRequestService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const dayjs_1 = __importDefault(require("dayjs"));
const student_booking_dto_1 = require("../../core/dtos/student/student.booking.dto");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let TeacherCallRequestService = class TeacherCallRequestService {
    constructor(_callRequestRepo, _availibilityRepo, _notificationRepo) {
        this._callRequestRepo = _callRequestRepo;
        this._availibilityRepo = _availibilityRepo;
        this._notificationRepo = _notificationRepo;
    }
    getPendingRequests(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callRequestRepo.findPending(page, limit);
        });
    }
    cancelBooking(bookingId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookingId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const cancelled = yield this._callRequestRepo.updateBookingStatus(bookingId, 'cancelled', reason);
            if (!cancelled)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.BOOKING_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, student_booking_dto_1.bookingDto)(cancelled);
        });
    }
    getConfirmedRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callRequestRepo.findConfirmed();
        });
    }
    getRequestDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callRequestRepo.findById(bookingId);
        });
    }
    getTeacherSlots(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const availability = yield this._availibilityRepo.getAvailabilityByTeacherId(teacherId);
            if (!availability)
                return [];
            const today = (0, dayjs_1.default)();
            const next7Days = Array.from({ length: 7 }, (_, i) => today.add(i, 'day'));
            const results = [];
            for (const date of next7Days) {
                const dayName = date.format('dddd');
                const formattedDate = date.format('YYYY-MM-DD'); // <-- fix here
                const matchingDay = availability.week.find((d) => d.day === dayName && d.enabled);
                if (!matchingDay)
                    continue;
                for (const slot of matchingDay.slots) {
                    const booking = yield this._callRequestRepo.findByTeacherDateSlot(teacherId, formattedDate, slot);
                    results.push({
                        _id: (_b = (_a = booking === null || booking === void 0 ? void 0 : booking._id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
                        date: formattedDate,
                        day: dayName,
                        slot,
                        status: booking ? booking.status : 'available',
                        student: (_c = booking === null || booking === void 0 ? void 0 : booking.studentId) === null || _c === void 0 ? void 0 : _c.toString(),
                        course: (_d = booking === null || booking === void 0 ? void 0 : booking.courseId) === null || _d === void 0 ? void 0 : _d.toString(),
                    });
                }
            }
            return results;
        });
    }
    approveRequest(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const updated = yield this._callRequestRepo.updateBookingStatus(bookingId, 'approved');
            if (!!updated) {
                yield this._notificationRepo.createNotification((_a = updated.studentId) === null || _a === void 0 ? void 0 : _a._id.toString(), 'Your Booking request approved!', ' Teacher approved request you can pay now .', 'booking', 'student');
            }
            return updated;
        });
    }
    rejectRequest(bookingId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callRequestRepo.rejectBooking(bookingId, reason);
        });
    }
    getHistory(teacherId, page, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const filter = { teacherId };
            if (status)
                filter.status = status;
            const [records, total] = yield Promise.all([
                this._callRequestRepo.getHistory(filter, skip, limit),
                this._callRequestRepo.countHistory(filter),
            ]);
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                data: records,
            };
        });
    }
};
exports.TeacherCallRequestService = TeacherCallRequestService;
exports.TeacherCallRequestService = TeacherCallRequestService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TeacherAvailabilityRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.NotificationRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], TeacherCallRequestService);
