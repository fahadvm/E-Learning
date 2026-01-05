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
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
const teacherProfileController = container_1.default.get(types_1.TYPES.TeacherProfileController);
const employeeTeacherReviewCtrl = container_1.default.get(types_1.TYPES.EmployeeTeacherReviewController);
// Profile Routes
router
    .route('/')
    .get((0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.getProfile.bind(teacherProfileController)))
    .post((0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.createProfile.bind(teacherProfileController)))
    .patch((0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.updateProfile.bind(teacherProfileController)));
router.post('/verify', upload.single('resume'), (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.sendVerificationRequest.bind(teacherProfileController)));
router.patch('/change-password', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.changePassword.bind(teacherProfileController)));
router.post('/change-email-otp', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.requestEmailChange.bind(teacherProfileController)));
router.post('/verify-change-email', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.verifyEmailChangeOtp.bind(teacherProfileController)));
router.get('/reviews/:teacherId', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(employeeTeacherReviewCtrl.getTeacherReviews.bind(employeeTeacherReviewCtrl)));
exports.default = router;
