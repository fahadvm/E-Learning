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
exports.CompanyPurchaseController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const CompanyOrder_1 = require("../../models/CompanyOrder");
const pdfkit_1 = __importDefault(require("pdfkit"));
let CompanyPurchaseController = class CompanyPurchaseController {
    constructor(_purchaseService) {
        this._purchaseService = _purchaseService;
    }
    createCheckoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
            const session = yield this._purchaseService.createCheckoutSession(companyId);
            const data = { url: session.url };
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PAYMENT_PAID_SUCCESSFULLY, true, data);
        });
    }
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { sessionId } = req.body;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!sessionId || !companyId) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const result = yield this._purchaseService.verifyPayment(sessionId, companyId);
            if (result.success) {
                (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY, true, result);
            }
            else {
                (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PAYMENT_VERIFICATION_FAILED, true, result);
            }
        });
    }
    // GET /api/company/orders/:orderId/receipt
    downloadReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId } = req.params;
            const order = yield CompanyOrder_1.CompanyOrderModel.findById(orderId).populate("purchasedCourses.courseId", "title price");
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            // Create PDF
            const doc = new pdfkit_1.default();
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=receipt_${orderId}.pdf`);
            // Pipe BEFORE writing
            doc.pipe(res);
            // Content
            doc.fontSize(20).text("Payment Receipt", { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Order ID: ${orderId}`);
            doc.text(`Total Paid: ₹${order.amount}`);
            doc.moveDown();
            doc.text("Purchased Courses:");
            order.purchasedCourses.forEach((item) => {
                const course = item.courseId;
                doc.text(`• ${course.title} — ₹${item.price} (${item.seats} seat${item.seats > 1 ? 's' : ''})`);
            });
            doc.end();
        });
    }
    getPurchasedCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
            const courses = yield this._purchaseService.getPurchasedCourses(companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSES_FETCHED, true, courses);
        });
    }
    getPurchasedCourseIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
            const courseIds = yield this._purchaseService.getMycoursesIdsById(companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSES_FETCHED, true, courseIds);
        });
    }
};
exports.CompanyPurchaseController = CompanyPurchaseController;
exports.CompanyPurchaseController = CompanyPurchaseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyPurchaseService)),
    __metadata("design:paramtypes", [Object])
], CompanyPurchaseController);
