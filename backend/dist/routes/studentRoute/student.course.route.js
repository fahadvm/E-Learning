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
const studentCourseCtrl = container_1.default.get(types_1.TYPES.StudentCourseController);
const studentCommentCtrl = container_1.default.get(types_1.TYPES.StudentCommentController);
router.get('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCourseCtrl.getAllCourses.bind(studentCourseCtrl)));
router.get('/:courseId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCourseCtrl.getCourseDetailById.bind(studentCourseCtrl)));
router.post('/compiler/run', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCourseCtrl.codecompiler.bind(studentCourseCtrl)));
router.post('/notes', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCourseCtrl.noteSaving.bind(studentCourseCtrl)));
router.get('/:courseId/lesson/:lessonIndex/complete', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCourseCtrl.markLessonComplete.bind(studentCourseCtrl)));
router.get('/resources/:courseId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCourseCtrl.getCourseResources.bind(studentCourseCtrl)));
router.route('/comment/:courseId')
    .get((0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCommentCtrl.getComments.bind(studentCourseCtrl)))
    .post((0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCommentCtrl.addComment.bind(studentCourseCtrl)));
router.delete('/comment/:commentId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentCommentCtrl.deleteComment.bind(studentCourseCtrl)));
exports.default = router;
