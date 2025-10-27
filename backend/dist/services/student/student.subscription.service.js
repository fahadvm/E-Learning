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
exports.StudentSubscriptionService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let StudentSubscriptionService = class StudentSubscriptionService {
    constructor(_planRepo) {
        this._planRepo = _planRepo;
    }
    getAllForStudent() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._planRepo.findAllForStudents();
        });
    }
    createOrder(studentId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._planRepo.findPlanById(planId);
            if (!plan)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND);
            if (plan.price <= 0) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_DATA);
            }
            const razorpay = new razorpay_1.default({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            });
            const order = yield razorpay.orders.create({
                amount: plan.price * 100,
                currency: 'INR',
                receipt: `order_${Date.now()}`
            });
            yield this._planRepo.saveStudentSubscription(studentId, planId, order.id);
            return order;
        });
    }
    verifyPayment(studentId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;
            const hmac = crypto_1.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
            hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
            const digest = hmac.digest('hex');
            if (digest !== razorpay_signature) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.PAYMENT_VERIFICATION_FAILED);
            }
            yield this._planRepo.updatePaymentStatus(razorpay_order_id, 'active', razorpay_payment_id);
        });
    }
    activateFreePlan(studentId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._planRepo.findPlanById(planId);
            if (!plan)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_DATA);
            if (typeof plan.price === 'number' && plan.price > 0) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_DATA);
            }
            yield this._planRepo.saveStudentSubscription(studentId, planId, `free_${Date.now()}`, 'free');
        });
    }
    getActiveSubscription(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._planRepo.findActiveSubscription(studentId);
        });
    }
};
exports.StudentSubscriptionService = StudentSubscriptionService;
exports.StudentSubscriptionService = StudentSubscriptionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object])
], StudentSubscriptionService);
