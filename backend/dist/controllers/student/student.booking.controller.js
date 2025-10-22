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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentBookingController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let StudentBookingController = class StudentBookingController {
    constructor(_bookingService) {
        this._bookingService = _bookingService;
        this.getAvailability = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teacherId } = req.params;
            if (!teacherId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const availability = yield this._bookingService.getAvailability(teacherId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.AVAILABILITY_FETCHED, true, availability);
        });
        this.bookSlot = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { teacherId, courseId, date, day, startTime, endTime, note } = req.body;
            if (!teacherId || !courseId || !date || !day || !startTime || !endTime)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const booking = yield this._bookingService.bookSlot(studentId, teacherId, courseId, date, day, startTime, endTime, note);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.BOOKING_CREATED, true, booking);
        });
        this.bookingDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const bookingId = req.params.bookingId;
            if (!bookingId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const booking = yield this._bookingService.getBookingDetails(bookingId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.BOOKING_CREATED, true, booking);
        });
        this.cancelBooking = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { bookingId } = req.params;
            const { reason } = req.body;
            if (!bookingId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const result = yield this._bookingService.cancelBooking(bookingId, reason);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.BOOKING_CANCELLED, true, result);
        });
        this.approveBooking = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { bookingId } = req.params;
            if (!bookingId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const result = yield this._bookingService.approveBooking(bookingId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.BOOKING_APPROVED, true, result);
        });
        this.payBooking = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { bookingId, amount } = req.body;
            if (!bookingId || !amount)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const result = yield this._bookingService.initiatePayment(bookingId, amount);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PAYMENT_SUCCESS, true, result);
        });
        this.verifyPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const verified = yield this._bookingService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            if (!!verified) {
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY, true, verified);
            }
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, ResponseMessages_1.MESSAGES.PAYMENT_VERIFICATION_FAILED, false, verified);
        });
        this.getHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { page = 1, limit = 5, status } = req.query;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const history = yield this._bookingService.getHistory(studentId, Number(page), Number(limit), status);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.HISTORY_FETCHED, true, history);
        });
        this.ScheduledCalls = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            console.log('req.query :', req.query);
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const schedules = yield this._bookingService.getScheduledCalls(studentId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CALL_REQUESTS_FETCHED, true, schedules);
        });
        this.AvailableBookingSlots = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teacherId } = req.params;
            const slots = yield this._bookingService.getAvailableSlots(teacherId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.AVAILABLE_SLOTS_FETCHED, true, slots);
        });
    }
};
exports.StudentBookingController = StudentBookingController;
exports.StudentBookingController = StudentBookingController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentBookingService)),
    __metadata("design:paramtypes", [Object])
], StudentBookingController);
