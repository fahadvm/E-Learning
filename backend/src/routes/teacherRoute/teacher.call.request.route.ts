import { Router } from "express";
import container from "../../core/di/container";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authMiddleware } from "../../middleware/authMiddleware";
import { TYPES } from "../../core/di/types";
import { TeacherCallRequestController } from "../../controllers/teacher/teacher.call.request.controller";
import { NotificationController } from "../../controllers/shared/notification.controller";
const callRequestCtrl = container.get<TeacherCallRequestController>(TYPES.TeacherCallRequestController);
const notificationCtrl = container.get<NotificationController>(TYPES.NotificationController);
const router = Router();

router.get("/", authMiddleware("teacher"), asyncHandler(callRequestCtrl.getMySlots.bind(callRequestCtrl)));
router.get("/pending", authMiddleware("teacher"), asyncHandler(callRequestCtrl.getPendingRequests.bind(callRequestCtrl)));
router.get("/confirmed", authMiddleware("teacher"), asyncHandler(callRequestCtrl.getConfirmedRequests.bind(callRequestCtrl)));
router.get("/:bookingId", authMiddleware("teacher"), asyncHandler(callRequestCtrl.getRequestDetails.bind(callRequestCtrl)));
router.patch("/:bookingId/approve", authMiddleware("teacher"), asyncHandler(callRequestCtrl.approveRequest.bind(callRequestCtrl)));
router.patch("/:bookingId/reject", authMiddleware("teacher"), asyncHandler(callRequestCtrl.rejectRequest.bind(callRequestCtrl)));
router.get("/notifications/testing/:userId", asyncHandler(notificationCtrl.getNotifications.bind(callRequestCtrl)));
router.post("/notifications/testing/markread", asyncHandler(notificationCtrl.markNotificationRead.bind(callRequestCtrl)));

export default router;
