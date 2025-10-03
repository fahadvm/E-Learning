"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../../core/di/container"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const router = express_1.default.Router();
const companyCourseController = container_1.default.get(types_1.TYPES.CompanyCourseController);
router.get('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyCourseController.getAllCourses.bind(companyCourseController)));
router.get('/:courseId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyCourseController.getCourseDetailById.bind(companyCourseController)));
exports.default = router;
