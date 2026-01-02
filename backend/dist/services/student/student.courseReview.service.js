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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentCourseReviewService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const mongoose_1 = __importDefault(require("mongoose"));
let StudentCourseReviewService = class StudentCourseReviewService {
    constructor(_reviewRepo, _courseRepo) {
        this._reviewRepo = _reviewRepo;
        this._courseRepo = _courseRepo;
    }
    addOrUpdateReview(studentId, courseId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this._reviewRepo.findStudentReview(studentId, courseId);
            let review;
            const studentIdObj = new mongoose_1.default.Types.ObjectId(studentId);
            const courseIdObj = new mongoose_1.default.Types.ObjectId(courseId);
            if (existing) {
                review = (yield this._reviewRepo.updateReview(studentId, courseId, {
                    rating,
                    comment,
                }));
            }
            else {
                review = yield this._reviewRepo.addReview({
                    studentId: studentIdObj,
                    courseId: courseIdObj,
                    rating,
                    comment,
                });
            }
            yield this.updateCourseStats(courseId);
            return review;
        });
    }
    deleteReview(studentId, reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._reviewRepo.deleteReview(studentId, reviewId);
            return;
        });
    }
    getCourseReviews(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._reviewRepo.getReviews(courseId);
        });
    }
    updateCourseStats(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const stats = yield this._reviewRepo.getCourseReviewStats(courseId);
            const avgRating = ((_a = stats[0]) === null || _a === void 0 ? void 0 : _a.avgRating) || 0;
            const reviewCount = ((_b = stats[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
            yield this._courseRepo.updateStatus(courseId, {
                averageRating: avgRating,
                reviewCount: reviewCount,
            });
        });
    }
};
exports.StudentCourseReviewService = StudentCourseReviewService;
exports.StudentCourseReviewService = StudentCourseReviewService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseReviewRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __metadata("design:paramtypes", [Object, Object])
], StudentCourseReviewService);
