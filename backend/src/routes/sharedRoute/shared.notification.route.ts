// src/routes/teacher.routes.ts
import { Router } from "express";
import { NotificationController } from "../../controllers/shared/notification.controller";
import container from "../../core/di/container";
import { TYPES } from "../../core/di/types";
const router = Router();
const controller = container.get<NotificationController>(TYPES.NotificationController);

router.get("/:userId", controller.getNotifications.bind(controller));
router.post("/mark-read", controller.markNotificationRead.bind(controller));

export default router;

