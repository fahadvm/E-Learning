"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const availabilityCtrl = container_1.default.get(types_1.TYPES.TeacherAvailabilityController);
router.post('/', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(availabilityCtrl.saveAvailability.bind(availabilityCtrl)));
router.get('/', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(availabilityCtrl.getMyAvailability.bind(availabilityCtrl)));
exports.default = router;
