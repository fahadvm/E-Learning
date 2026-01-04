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
const courseRouter = (0, express_1.Router)();
const employeeCourseCtrl = container_1.default.get(types_1.TYPES.EmployeeCourseController);
const employeeCommentCtrl = container_1.default.get(types_1.TYPES.EmployeeCommentController);
const employeeCourseReviewCtrl = container_1.default.get(types_1.TYPES.EmployeeCourseReviewController);
courseRouter.get('/enrolled', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.myCourses.bind(employeeCourseCtrl)));
courseRouter.get('/enrolled/:courseId', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.myCourseDetails.bind(employeeCourseCtrl)));
courseRouter.post('/compiler/run', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.codecompiler.bind(employeeCourseCtrl)));
courseRouter.post('/notes', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.noteSaving.bind(employeeCourseCtrl)));
courseRouter.get('/:courseId/lesson/:lessonIndex/complete', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.markLessonComplete.bind(employeeCourseCtrl)));
courseRouter.patch('/tracking/time', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.trackLearningTime.bind(employeeCourseCtrl)));
courseRouter.get('/resources/:courseId', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.getCourseResources.bind(employeeCourseCtrl)));
courseRouter.get('/progress', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.getCourseProgress.bind(employeeCourseCtrl)));
courseRouter.get('/leaningRecords', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.getLearningRecords.bind(employeeCourseCtrl)));
courseRouter.route('/comment/:courseId')
    .get((0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCommentCtrl.getComments.bind(employeeCommentCtrl)))
    .post((0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCommentCtrl.addComment.bind(employeeCommentCtrl)));
courseRouter.delete('/comment/:commentId', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCommentCtrl.deleteComment.bind(employeeCommentCtrl)));
courseRouter.post('/course-review', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseReviewCtrl.addReview.bind(employeeCourseReviewCtrl)));
courseRouter.get('/course-reviews/:courseId', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseReviewCtrl.getReviews.bind(employeeCourseReviewCtrl)));
courseRouter.delete('/course-review/:reviewId', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseReviewCtrl.deleteReview.bind(employeeCourseReviewCtrl)));
exports.default = courseRouter;
