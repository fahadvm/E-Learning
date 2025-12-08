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
exports.TeacherCallRequestController = void 0;
const inversify_1 = require("inversify");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
let TeacherCallRequestController = class TeacherCallRequestController {
    constructor(_notificationService, _callRequestService) {
        this._notificationService = _notificationService;
        this._callRequestService = _callRequestService;
    }
    getPendingRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const requests = yield this._callRequestService.getPendingRequests(page, limit);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CALL_REQUESTS_FETCHED, true, requests);
        });
    }
    getMySlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const teacherId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!teacherId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const slots = yield this._callRequestService.getTeacherSlots(teacherId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Slots fetched successfully', true, slots);
        });
    }
    getConfirmedRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield this._callRequestService.getConfirmedRequests();
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CALL_REQUESTS_FETCHED, true, requests);
        });
    }
    getRequestDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingId } = req.params;
            const request = yield this._callRequestService.getRequestDetails(bookingId);
            if (!request)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.CALL_REQUEST_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CALL_REQUEST_DETAILS_FETCHED, true, request);
        });
    }
    approveRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingId } = req.params;
            const updated = yield this._callRequestService.approveRequest(bookingId);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.CALL_REQUEST_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CALL_REQUEST_APPROVED, true, updated);
        });
    }
    rejectRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingId } = req.params;
            const { reason } = req.body;
            const updated = yield this._callRequestService.rejectRequest(bookingId, reason);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.CALL_REQUEST_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CALL_REQUEST_REJECTED, true, updated);
        });
    }
    atest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            if (!userId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const notifications = yield this._notificationService.getUserNotifications(userId);
            const updated = { name: ' fahad' };
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.CALL_REQUEST_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CALL_REQUEST_REJECTED, true, notifications);
        });
    }
    atestmark(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notificationId } = req.body;
            if (!notificationId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOTIFICATION_ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const updatedNotification = yield this._notificationService.markAsRead(notificationId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.NOTIFICATION_MARKED_AS_READ, true, updatedNotification);
        });
    }
    getRequestHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 5, status } = req.query;
            const teacherId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!teacherId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const result = yield this._callRequestService.getHistory(teacherId, Number(page), Number(limit), status);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Booking history fetched suceessfully', true, result);
        });
    }
    rescheduleRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingId } = req.params;
            const { reason, nextSlot } = req.body;
            if (!bookingId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const result = yield this._callRequestService.rescheduleBooking(bookingId, reason, nextSlot);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.BOOKING_CANCELLED, true, result);
        });
    }
};
exports.TeacherCallRequestController = TeacherCallRequestController;
exports.TeacherCallRequestController = TeacherCallRequestController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.NotificationService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TeacherCallRequestService)),
    __metadata("design:paramtypes", [Object, Object])
], TeacherCallRequestController);
