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
dotenv_1.default.config();
let CompanyPurchaseService = class CompanyPurchaseService {
    constructor(_companyOrderRepo, _courseRepo, _cartRepo, _companyRepo) {
        this._companyOrderRepo = _companyOrderRepo;
        this._courseRepo = _courseRepo;
        this._cartRepo = _cartRepo;
        this._companyRepo = _companyRepo;
    }
    /**
     * Create a Stripe Checkout session for a company
     */
    createCheckoutSession(courseIds, companyId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("creating course ids are ", courseIds);
            const Company = yield this._companyRepo.findById(companyId);
            const session = yield stripe_1.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: (Company === null || Company === void 0 ? void 0 : Company.name) || 'unknown',
                                description: 'Purchase courses from devnext!',
                            },
                            unit_amount: amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/company/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/company/checkout/cancel`,
            });
            const companyIdObj = new mongoose_1.default.Types.ObjectId(companyId);
            const courseObjIds = courseIds.map(id => new mongoose_1.default.Types.ObjectId(id));
            yield this._companyOrderRepo.create({
                companyId: companyIdObj,
                courses: courseObjIds,
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
            const session = yield stripe_1.stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['payment_intent'],
            });
            if (session.payment_status === 'paid') {
                yield this._companyOrderRepo.updateStatus(sessionId, 'paid');
                yield this._cartRepo.clearCart(companyId);
                const order = yield this._companyOrderRepo.findByStripeSessionId(sessionId);
                return { success: true, amount: order === null || order === void 0 ? void 0 : order.amount };
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
};
exports.CompanyPurchaseService = CompanyPurchaseService;
exports.CompanyPurchaseService = CompanyPurchaseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyOrderRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CartRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CompanyPurchaseService);
