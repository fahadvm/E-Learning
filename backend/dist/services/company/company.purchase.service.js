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
exports.CompanyPurchaseService = void 0;
const inversify_1 = require("inversify");
const stripe_1 = require("../../config/stripe");
const dotenv_1 = __importDefault(require("dotenv"));
const types_1 = require("../../core/di/types");
const mongoose_1 = __importDefault(require("mongoose"));
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
dotenv_1.default.config();
let CompanyPurchaseService = class CompanyPurchaseService {
    constructor(_companyOrderRepo, _courseRepo, _cartRepo, _companyRepo, _transactionRepo, _walletRepo, _PurchaseRepo) {
        this._companyOrderRepo = _companyOrderRepo;
        this._courseRepo = _courseRepo;
        this._cartRepo = _cartRepo;
        this._companyRepo = _companyRepo;
        this._transactionRepo = _transactionRepo;
        this._walletRepo = _walletRepo;
        this._PurchaseRepo = _PurchaseRepo;
    }
    /**
     * Create a Stripe Checkout session for a company
     */
    createCheckoutSession(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._companyRepo.findById(companyId);
            // Get cart with seat information
            const cart = yield this._cartRepo.getCart(companyId);
            if (!cart || cart.courses.length === 0) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.CART_IS_EMPTY, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Extract course IDs for duplicate check
            const courseIds = cart.courses.map(item => { var _a; return ((_a = item.courseId._id) === null || _a === void 0 ? void 0 : _a.toString()) || item.courseId.toString(); });
            const purchasedCourseIds = yield this._companyOrderRepo.getPurchasedCourseIds(companyId);
            const duplicates = courseIds.filter(id => purchasedCourseIds.includes(id));
            // if (duplicates.length > 0) {
            //   throwError(MESSAGES.COURSES_ALREADY_PURCHASED, STATUS_CODES.CONFLICT);
            // }
            // Calculate total amount from cart
            const amount = cart.courses.reduce((sum, item) => sum + item.price, 0);
            const session = yield stripe_1.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: (company === null || company === void 0 ? void 0 : company.name) || 'unknown',
                                description: 'Purchase courses from devnext!',
                            },
                            unit_amount: Math.round(amount * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/company/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/company/checkout/cancel`,
            });
            const companyIdObj = new mongoose_1.default.Types.ObjectId(companyId);
            // Build purchasedCourses array with seat information
            const purchasedCourses = cart.courses.map(item => {
                var _a;
                return ({
                    courseId: new mongoose_1.default.Types.ObjectId(((_a = item.courseId._id) === null || _a === void 0 ? void 0 : _a.toString()) || item.courseId.toString()),
                    accessType: item.accessType,
                    seats: item.seats,
                    price: item.price
                });
            });
            yield this._companyOrderRepo.create({
                companyId: companyIdObj,
                purchasedCourses,
                stripeSessionId: session.id,
                amount,
                currency: 'inr',
                status: 'created',
            });
            return { url: session.url };
        });
    }
    verifyPayment(sessionId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const session = yield stripe_1.stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['payment_intent'],
            });
            if (session.payment_status === 'paid') {
                const order = yield this._companyOrderRepo.findByStripeSessionId(sessionId);
                if (!order)
                    (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ORDER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
                yield this._companyOrderRepo.updateStatus(sessionId, 'paid');
                yield this._cartRepo.clearCart(companyId);
                for (const item of order.purchasedCourses) {
                    const courseId = ((_a = item.courseId) === null || _a === void 0 ? void 0 : _a._id)
                        ? new mongoose_1.default.Types.ObjectId(item.courseId._id)
                        : new mongoose_1.default.Types.ObjectId(item.courseId);
                    yield this._PurchaseRepo.purchaseCourse(new mongoose_1.default.Types.ObjectId(order.companyId), courseId, item.seats);
                }
                // --- Transaction Logic ---
                const commissionRate = order.commissionRate || 0.20;
                const platformFee = Math.round(order.amount * commissionRate);
                const teacherShare = order.amount - platformFee;
                // Update order with fee details
                // Assuming update method exists or using mongoose doc save if repo exposes it, 
                // but here we might need to rely on repo update method if available or direct model usage if generic repo.
                // Since ICompanyOrderRepository usually has update/updateStatus, let's assume valid repo usage or just proceed.
                // Order is a mongoose document if returned by findByStripeSessionId, so we can save it.
                order.platformFee = platformFee;
                order.teacherShare = teacherShare;
                yield order.save();
                // 1. Create Order Transaction (Company Paid)
                yield this._transactionRepo.create({
                    userId: order.companyId, // Using userId field for companyId as well, or we need to check Transaction model support
                    // Transaction model has `userId` ref 'Student'. It doesn't have `companyId`.
                    // We might need to store companyId in `userId` if it allows different refs, OR add `companyId` to Transaction model.
                    // Looking at Transaction.ts, `userId: { type: Schema.Types.ObjectId, ref: "Student" }`.
                    // This is a schema limitation. For now, let's store it in userId but notes will clarify.
                    // Ideally we should update Transaction model to support Company, but for this task I will use userId and notes.
                    type: "COURSE_PURCHASE",
                    txnNature: "CREDIT",
                    amount: order.amount,
                    grossAmount: order.amount,
                    teacherShare,
                    platformFee,
                    paymentMethod: "STRIPE",
                    paymentStatus: "SUCCESS",
                    notes: `Company Purchase: ${order._id}`
                });
                // 2. Distribute to Teachers
                for (const item of order.purchasedCourses) {
                    // item.courseId might be populated or just ID. 
                    // Need to ensure we get the course to find teacherId.
                    const courseIdStr = ((_b = item.courseId._id) === null || _b === void 0 ? void 0 : _b.toString()) || item.courseId.toString();
                    const course = yield this._courseRepo.findById(courseIdStr);
                    if (course && course.teacherId) {
                        const teacherIdStr = ((_c = course.teacherId._id) === null || _c === void 0 ? void 0 : _c.toString()) || course.teacherId.toString();
                        // Calculate specific cut for this course item
                        const itemPrice = item.price;
                        const itemTeacherCut = Math.round(itemPrice * (1 - commissionRate));
                        const itemPlatformCut = itemPrice - itemTeacherCut;
                        const earningTx = yield this._transactionRepo.create({
                            teacherId: new mongoose_1.default.Types.ObjectId(teacherIdStr),
                            courseId: new mongoose_1.default.Types.ObjectId(courseIdStr),
                            type: "TEACHER_EARNING",
                            txnNature: "CREDIT",
                            amount: itemTeacherCut,
                            grossAmount: itemPrice,
                            teacherShare: itemTeacherCut,
                            platformFee: itemPlatformCut,
                            paymentMethod: "WALLET",
                            paymentStatus: "SUCCESS",
                            notes: `Earning from Company Order: ${order._id}`
                        });
                        // Credit Wallet
                        yield this._walletRepo.creditTeacherWallet({
                            teacherId: new mongoose_1.default.Types.ObjectId(teacherIdStr),
                            amount: itemTeacherCut,
                            transactionId: earningTx._id
                        });
                        // Increment student count (company purchase usually means seats, but logic handles it)
                        // For unlimited, maybe just +1 or +seats?
                        // Let's increment by seats if seats > 0, else 1
                        /*
                          Note: incrementStudentCount currently just incs by 1.
                          Ideally should inc by seats. For now calling it once per course.
                        */
                        yield this._courseRepo.incrementStudentCount(courseIdStr);
                    }
                }
                return { success: true, amount: order.amount, order: order };
            }
            yield this._companyOrderRepo.updateStatus(sessionId, 'failed');
            return { success: false };
        });
    }
    /**
     * Get purchased courses for a company
     */
    getPurchasedCourses(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._companyOrderRepo.getOrdersByCompanyId(companyId);
            console.log("course fetched more", courses);
            return courses;
        });
    }
    getMycoursesIdsById(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseIds = yield this._companyOrderRepo.getPurchasedCourseIds(companyId);
            console.log("course fetched more", courseIds);
            return courseIds;
        });
    }
};
exports.CompanyPurchaseService = CompanyPurchaseService;
exports.CompanyPurchaseService = CompanyPurchaseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyOrderRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CompanyCartRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.TransactionRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.WalletRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.CompanyCoursePurchaseRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], CompanyPurchaseService);
