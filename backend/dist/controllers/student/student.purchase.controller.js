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
exports.StudentPurchaseController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let StudentPurchaseController = class StudentPurchaseController {
    constructor(_PurchaseService) {
        this._PurchaseService = _PurchaseService;
        this.createOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { courses, amount } = req.body;
            if (!courses || !amount)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const order = yield this._PurchaseService.createOrder(studentId, courses, amount);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.ORDER_CREATED_SUCCESSFULLY, true, order);
        });
        this.verifyPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
            const verified = yield this._PurchaseService.verifyPayment(req.body, studentId);
            return verified.success
                ? (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY, true, verified)
                : (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, ResponseMessages_1.MESSAGES.PAYMENT_VERIFICATION_FAILED, false, verified);
        });
        this.getMyCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const courses = yield this._PurchaseService.getPurchasedCourses(studentId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSES_FETCHED, true, courses);
        });
        this.getMyCourseDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const courseId = req.params.courseId;
            if (!courseId || !studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const course = yield this._PurchaseService.getPurchasedCourseDetails(courseId, studentId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSES_FETCHED, true, course);
        });
        this.getOrderDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED);
            const { razorpayOrderId } = req.params;
            const order = yield this._PurchaseService.getOrderDetails(studentId, razorpayOrderId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.ORDER_FETCHED_SUCCESSFULLY, true, order);
        });
        this.getPurchaseHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = yield this._PurchaseService.getPurchaseHistory(studentId, page, limit);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PURCHASE_HISTORY_FETCHED, true, result);
        });
    }
    getPurchasedCourseIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const courseIds = yield this._PurchaseService.getPurchasedCourseIds(studentId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSE_IDS_FETCHED, true, courseIds);
        });
    }
};
exports.StudentPurchaseController = StudentPurchaseController;
exports.StudentPurchaseController = StudentPurchaseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentPurchaseService)),
    __metadata("design:paramtypes", [Object])
], StudentPurchaseController);
