// routes/student/student.booking.routes.ts
import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { asyncHandler } from "../../middleware/asyncHandler";
import container from "../../core/di/container";
import { TYPES } from "../../core/di/types";
import { StudentBookingController } from "../../controllers/student/student.booking.controller";

const router = Router();
const bookingCtrl = container.get<StudentBookingController>(TYPES.StudentBookingController);


router.get("/:teacherId/available-slots", authMiddleware("student"), asyncHandler(bookingCtrl.AvailableBookingSlots.bind(bookingCtrl)));
router.post("/", authMiddleware("student"), asyncHandler(bookingCtrl.bookSlot.bind(bookingCtrl)));
router.patch("/:bookingId/cancel", authMiddleware("student"), asyncHandler(bookingCtrl.cancelBooking.bind(bookingCtrl)));
router.patch("/:bookingId/approve", authMiddleware("student"), asyncHandler(bookingCtrl.approveBooking.bind(bookingCtrl)));
router.post("/payments", authMiddleware("student"), asyncHandler(bookingCtrl.payBooking.bind(bookingCtrl)));
router.get("/history", authMiddleware("student"), asyncHandler(bookingCtrl.getHistory.bind(bookingCtrl)));

export default router;
