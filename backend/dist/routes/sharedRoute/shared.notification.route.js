"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/teacher.routes.ts
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const controller = container_1.default.get(types_1.TYPES.NotificationController);
router.get('/:userId', controller.getNotifications.bind(controller));
router.post('/mark-read', controller.markNotificationRead.bind(controller));
exports.default = router;
