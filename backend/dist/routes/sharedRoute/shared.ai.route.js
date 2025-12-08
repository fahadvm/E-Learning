"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const router = (0, express_1.Router)();
const controller = container_1.default.get(types_1.TYPES.AiTutorController);
router.post('/message/:courseId', (0, asyncHandler_1.asyncHandler)(controller.askQuestion.bind(controller)));
exports.default = router;
