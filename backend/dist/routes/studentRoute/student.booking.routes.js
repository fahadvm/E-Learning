"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/student/student.booking.routes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const bookingCtrl = container_1.default.get(types_1.TYPES.StudentBookingController);
router.get('/:teacherId/available-slots', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.AvailableBookingSlots.bind(bookingCtrl)));
router.get('/:bookingId/details', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.bookingDetails.bind(bookingCtrl)));
router.get('/:paymentOrderId/paymentOrderIdDetails', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.bookingDetailsByPaymentId.bind(bookingCtrl)));
router.post('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.lockSlot.bind(bookingCtrl)));
router.patch('/:bookingId/cancel', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.cancelBooking.bind(bookingCtrl)));
router.get('/:bookingId/approve', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.approveBooking.bind(bookingCtrl)));
router.patch('/:bookingId/reject', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.rejectBooking.bind(bookingCtrl)));
router.post('/payments', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.payBooking.bind(bookingCtrl)));
router.post('/payments/verify', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.verifyPayment.bind(bookingCtrl)));
router.get('/history', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.getHistory.bind(bookingCtrl)));
router.get('/ScheduledCall', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(bookingCtrl.ScheduledCalls.bind(bookingCtrl)));
exports.default = router;
