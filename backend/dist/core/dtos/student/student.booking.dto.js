"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsDto = exports.bookingDto = void 0;
const bookingDto = (booking) => {
    var _a;
    return ({
        id: ((_a = booking._id) === null || _a === void 0 ? void 0 : _a.toString()) || booking.id,
        studentId: booking.studentId.toString(),
        teacherId: booking.teacherId.toString(),
        courseId: booking.courseId.toString(),
        slot: booking.slot,
        date: booking.date,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    });
};
exports.bookingDto = bookingDto;
const bookingsDto = (bookings) => bookings.map(exports.bookingDto);
exports.bookingsDto = bookingsDto;
