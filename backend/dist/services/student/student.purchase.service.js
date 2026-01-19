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
const logger_1 = __importDefault(require("../../utils/logger"));
const cloudinarySign_1 = require("../../utils/cloudinarySign");
const Student_course_Dto_1 = require("../../core/dtos/student/Student.course.Dto");
let StudentPurchaseService = class StudentPurchaseService {
    constructor(_orderRepo, _courseRepo, _cartRepo, _studentRepo, _subscriptionRepo, _transactionRepo, _walletRepo) {
        this._orderRepo = _orderRepo;
        this._courseRepo = _courseRepo;
        this._cartRepo = _cartRepo;
        this._studentRepo = _studentRepo;
        this._subscriptionRepo = _subscriptionRepo;
        this._transactionRepo = _transactionRepo;
        this._walletRepo = _walletRepo;
        this._razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    createOrder(studentId_1, courses_1, amount_1) {
        return __awaiter(this, arguments, void 0, function* (studentId, courses, amount, currency = 'INR') {
            logger_1.default.debug(`amount is  ${amount}`);
            // Verify if any course is blocked
            for (const courseId of courses) {
                const course = yield this._courseRepo.findById(courseId);
                if (!course)
                    (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
                if (course.isBlocked) {
                    (0, ResANDError_1.throwError)(`The course "${course.title}" is currently unavailable as it has been blocked by admin.`, HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
                }
            }
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
                status: 'created',
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
            var _a;
            logger_1.default.debug(details.razorpay_order_id, details.razorpay_payment_id, details.razorpay_signature);
            const body = `${details.razorpay_order_id}|${details.razorpay_payment_id}`;
            const expectedSignature = crypto_1.default
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');
            const isValid = expectedSignature === details.razorpay_signature;
            yield this._orderRepo.updateStatus(details.razorpay_order_id, isValid ? 'paid' : 'failed');
            if (!isValid) {
                yield this._cartRepo.clearCart(studentId);
                return { success: false };
            }
            // ---------------- STEP 1: Fetch order ----------------
            const order = yield this._orderRepo.findByRazorpayOrderId(details.razorpay_order_id);
            // CORRECTED: check order existence and id properly
            if (!order || !order._id)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ORDER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const studentObjId = new mongoose_1.default.Types.ObjectId(studentId);
            // ---------------- STEP 2: Calculate platform fee + teacher share ----------------
            const commissionRate = typeof order.commissionRate === 'number' ? order.commissionRate : 0.20;
            const platformFee = Math.round(order.amount * commissionRate);
            const teacherShare = order.amount - platformFee;
            // Save platformFee + share into the order (cast id to ObjectId for update)
            yield this._orderRepo.update(order._id, {
                platformFee,
                teacherShare,
            });
            // ---------------- STEP 3: Create COURSE_PURCHASE transaction ----------------
            yield this._transactionRepo.create({
                userId: studentObjId,
                type: 'COURSE_PURCHASE',
                txnNature: 'CREDIT',
                amount: order.amount,
                grossAmount: order.amount,
                teacherShare: teacherShare,
                platformFee: platformFee,
                paymentMethod: 'RAZORPAY',
                paymentStatus: 'SUCCESS',
                notes: `Purchase for courses: ${order.courses.join(',')}`,
            });
            // ---------------- STEP 4: Loop each course -> TEACHER_EARNING + wallet credit ----------------
            // Normalize course ids and handle typing (order.courses may be ObjectId[] or string[])
            for (const rawCourseId of order.courses) {
                // Normalize courseId to a string (safe) and an ObjectId for DB usage
                const courseIdStr = ((_a = rawCourseId._id) === null || _a === void 0 ? void 0 : _a.toString()) || rawCourseId.toString();
                if (!courseIdStr)
                    continue;
                const course = (yield this._courseRepo.findById(courseIdStr));
                if (!course)
                    continue;
                // teacherId may be ObjectId or a populated document; normalize to string/ObjectId
                const rawTeacherId = course.teacherId._id || course.teacherId;
                if (!rawTeacherId)
                    continue;
                // teacherIdNormalized will be a string id we can pass to mongoose when needed
                const teacherIdStr = rawTeacherId.toString();
                if (!teacherIdStr)
                    continue;
                // course price: prefer course.price, otherwise split equally
                const coursePrice = typeof course.price === 'number'
                    ? course.price
                    : Math.round(order.amount / order.courses.length);
                const teacherCut = Math.round(coursePrice * (1 - commissionRate));
                const platformCut = coursePrice - teacherCut;
                // Create TEACHER_EARNING transaction
                const earningTx = yield this._transactionRepo.create({
                    teacherId: new mongoose_1.default.Types.ObjectId(teacherIdStr),
                    courseId: new mongoose_1.default.Types.ObjectId(courseIdStr),
                    type: 'TEACHER_EARNING',
                    txnNature: 'CREDIT',
                    amount: teacherCut,
                    grossAmount: coursePrice,
                    teacherShare: teacherCut,
                    platformFee: platformCut,
                    paymentMethod: 'WALLET',
                    paymentStatus: 'SUCCESS',
                    notes: `Earning for course ${courseIdStr}`,
                });
                // Credit teacher wallet (atomic upsert)
                yield this._walletRepo.creditTeacherWallet({
                    teacherId: new mongoose_1.default.Types.ObjectId(teacherIdStr),
                    amount: teacherCut,
                    transactionId: earningTx._id,
                });
                yield this._courseRepo.incrementStudentCount(courseIdStr);
            }
            yield this._cartRepo.clearCart(studentId);
            return { success: true };
        });
    }
    getPurchasedCourses(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const ispremium = await this._subscriptionRepo.findActiveSubscription(studentId);
            const orders = yield this._orderRepo.getOrdersByStudentId(studentId);
            return orders;
        });
    }
    getPurchasedCourseIds(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseIds = yield this._orderRepo.getOrderedCourseIds(studentId);
            return courseIds;
        });
    }
    getPurchasedCourseDetails(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!courseId || !studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const student = yield this._studentRepo.findById(studentId);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const purchasedCourseIds = yield this._orderRepo.getOrderedCourseIds(studentId);
            const hasPurchased = purchasedCourseIds.some((id) => id.toString() === courseId.toString());
            if (!hasPurchased) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_PURCHASED, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            }
            const progress = yield this._studentRepo.getOrCreateCourseProgress(studentId, courseId);
            // Sign URLs for course content
            const signedCourse = (0, cloudinarySign_1.signCourseUrls)(course);
            const recommended = yield this._courseRepo.findRecommendedCourses(courseId, course.category, course.level, 6);
            return {
                course: (0, Student_course_Dto_1.PurchasedCourseDTO)(signedCourse),
                progress,
                recommended: recommended.map(Student_course_Dto_1.StudentCourseDTO)
            };
        });
    }
    getOrderDetails(studentId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this._orderRepo.getOrderDetailsByrazorpayOrderId(studentId, orderId);
            if (!order)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ORDER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return order;
        });
    }
    getPurchaseHistory(studentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page < 1)
                page = 1;
            if (limit < 1)
                limit = 10;
            const { orders, total } = yield this._orderRepo.findOrdersByStudent(studentId, page, limit);
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                orders,
            };
        });
    }
};
exports.StudentPurchaseService = StudentPurchaseService;
exports.StudentPurchaseService = StudentPurchaseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.OrderRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CartRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.StudentRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.SubscriptionPlanRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.TransactionRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.WalletRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], StudentPurchaseService);
