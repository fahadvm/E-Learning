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
exports.StudentSubscriptionController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let StudentSubscriptionController = class StudentSubscriptionController {
    constructor(_planService) {
        this._planService = _planService;
        this.getAllStudentPlans = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            const plans = yield this._planService.getAllForStudent();
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLANS_FETCHED, true, plans);
        });
        this.getAllPlans = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            const plans = yield this._planService.getAllPlans();
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLANS_FETCHED, true, plans);
        });
        this.createOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { planId } = req.body;
            if (!planId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const order = yield this._planService.createOrder(studentId, planId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.ORDER_CREATED, true, order);
        });
        this.verifyPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const result = yield this._planService.verifyPayment(studentId, req.body);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY, true, result);
        });
        this.activateFreePlan = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { planId } = req.body;
            if (!planId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const subscription = yield this._planService.activateFreePlan(studentId, planId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.FREE_PLAN_ACTIVATED, true, subscription);
        });
        this.getActiveSubscription = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const activeSub = yield this._planService.getActiveSubscription(studentId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.ACTIVE_SUBSCRIPTION_FETCHED, true, activeSub);
        });
    }
};
exports.StudentSubscriptionController = StudentSubscriptionController;
exports.StudentSubscriptionController = StudentSubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentSubscriptionService)),
    __metadata("design:paramtypes", [Object])
], StudentSubscriptionController);
