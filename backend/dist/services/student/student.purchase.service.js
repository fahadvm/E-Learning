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
exports.StudentPurchaseService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let StudentPurchaseService = class StudentPurchaseService {
    constructor(_orderRepo, _courseRepo, _cartRepo, _subscriptionRepo) {
        this._orderRepo = _orderRepo;
        this._courseRepo = _courseRepo;
        this._cartRepo = _cartRepo;
        this._subscriptionRepo = _subscriptionRepo;
        this._razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    createOrder(studentId_1, courses_1, amount_1) {
        return __awaiter(this, arguments, void 0, function* (studentId, courses, amount, currency = "INR") {
            console.log("amount is ", amount);
            const options = {
                amount: amount * 100,
                currency,
                receipt: `receipt_${Date.now()}`,
                notes: { studentId, courses: JSON.stringify(courses) },
            };
            const razorpayOrder = yield this._razorpay.orders.create(options);
            const studentObjId = new mongoose_1.default.Types.ObjectId(studentId);
            const courseObjIds = courses.map(id => new mongoose_1.default.Types.ObjectId(id));
            const newOrder = yield this._orderRepo.create({
                studentId: studentObjId,
                courses: courseObjIds,
                razorpayOrderId: razorpayOrder.id,
                amount,
                currency: razorpayOrder.currency,
                status: "created",
            });
            return {
                _id: newOrder._id,
                razorpayOrderId: newOrder.razorpayOrderId,
                amount: newOrder.amount,
                currency: newOrder.currency,
                status: newOrder.status,
                studentId: newOrder.studentId,
                courses: newOrder.courses,
            };
        });
    }
    verifyPayment(details, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(details.razorpay_order_id, details.razorpay_payment_id, details.razorpay_signature);
            const body = `${details.razorpay_order_id}|${details.razorpay_payment_id}`;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest("hex");
            const isValid = expectedSignature === details.razorpay_signature;
            console.log("until here everything is fine", details.razorpay_order_id, isValid);
            yield this._orderRepo.updateStatus(details.razorpay_order_id, isValid ? "paid" : "failed");
            yield this._cartRepo.clearCart(studentId);
            return { success: isValid };
        });
    }
    getPurchasedCourses(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ispremium = yield this._subscriptionRepo.findActiveSubscription(studentId);
            if (ispremium) {
                console.log("this user id premium member ");
                // const courses = await this._courseRepo.getPremiumCourses();  
                // return courses
            }
            const orders = yield this._orderRepo.getOrdersByStudentId(studentId);
            return orders;
        });
    }
    getPurchasedCourseDetails(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return course;
        });
    }
};
exports.StudentPurchaseService = StudentPurchaseService;
exports.StudentPurchaseService = StudentPurchaseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.OrderRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CartRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.SubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], StudentPurchaseService);
