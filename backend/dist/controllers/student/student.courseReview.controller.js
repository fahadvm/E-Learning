"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentCourseReviewController = void 0;
const inversify_1 = require("inversify");
const student_courseReview_service_1 = require("../../services/student/student.courseReview.service");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let StudentCourseReviewController = class StudentCourseReviewController {
    constructor(_reviewService) {
        this._reviewService = _reviewService;
        this.addReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { courseId, rating, comment } = req.body;
            console.log("posting review is working 1", req.body);
            if (!rating || !courseId)
                (0, ResANDError_1.throwError)("Rating and Course ID required");
            const review = yield this._reviewService.addOrUpdateReview(studentId, courseId, rating, comment);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, "Course review saved", true, review);
        });
        this.getReviews = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("trying to geting reviews");
            const { courseId } = req.params;
            const reviews = yield this._reviewService.getCourseReviews(courseId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, "Course reviews fetched", true, reviews);
        });
        this.deleteReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { reviewId } = req.params;
            yield this._reviewService.deleteReview(studentId, reviewId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, "Course review deleted", true);
        });
    }
};
exports.StudentCourseReviewController = StudentCourseReviewController;
exports.StudentCourseReviewController = StudentCourseReviewController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentCourseReviewService)),
    __metadata("design:paramtypes", [student_courseReview_service_1.StudentCourseReviewService])
], StudentCourseReviewController);
