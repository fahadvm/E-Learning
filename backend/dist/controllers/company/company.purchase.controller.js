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
exports.CompanyPurchaseController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let CompanyPurchaseController = class CompanyPurchaseController {
    constructor(_purchaseService) {
        this._purchaseService = _purchaseService;
    }
    createCheckoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { courses, amount } = req.body;
            console.log("courses ids in controller,", courses);
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const session = yield this._purchaseService.createCheckoutSession(courses, companyId, amount);
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
};
exports.CompanyPurchaseController = CompanyPurchaseController;
exports.CompanyPurchaseController = CompanyPurchaseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyPurchaseService)),
    __metadata("design:paramtypes", [Object])
], CompanyPurchaseController);
