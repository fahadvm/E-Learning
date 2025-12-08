"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const controller = container_1.default.get(types_1.TYPES.EmployeeLearningPathController);
// GET all assigned LPs
router.get("/", (0, authMiddleware_1.authMiddleware)("employee"), (0, asyncHandler_1.asyncHandler)(controller.getAssignedPaths.bind(controller)));
// GET detail of one LP
router.get("/:learningPathId", (0, authMiddleware_1.authMiddleware)("employee"), (0, asyncHandler_1.asyncHandler)(controller.getLearningPathDetail.bind(controller)));
// Mark course completed → update progress
router.post("/progress/update", (0, authMiddleware_1.authMiddleware)("employee"), (0, asyncHandler_1.asyncHandler)(controller.updateProgress.bind(controller)));
// Pause / Resume LP
router.patch("/status", (0, authMiddleware_1.authMiddleware)("employee"), (0, asyncHandler_1.asyncHandler)(controller.updateStatus.bind(controller)));
exports.default = router;
