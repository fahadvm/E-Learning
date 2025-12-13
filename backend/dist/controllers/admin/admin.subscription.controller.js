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
exports.AdminSubscriptionPlanController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let AdminSubscriptionPlanController = class AdminSubscriptionPlanController {
    constructor(_planService) {
        this._planService = _planService;
    }
    createPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._planService.createPlan(req.body);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLAN_CREATED, true, plan);
        });
    }
    getAllPlans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield this._planService.getAllPlans();
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLANS_FETCHED, true, plans);
        });
    }
    getPlanById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._planService.getPlanById(req.params.planId);
            if (!plan) {
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND, ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND, false, null);
            }
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLAN_FETCHED, true, plan);
        });
    }
    updatePlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._planService.updatePlan(req.params.planId, req.body);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLAN_UPDATED, true, updated);
        });
    }
    deletePlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._planService.deletePlan(req.params.planId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.SUBSCRIPTION_PLAN_DELETED, true, null);
        });
    }
};
exports.AdminSubscriptionPlanController = AdminSubscriptionPlanController;
exports.AdminSubscriptionPlanController = AdminSubscriptionPlanController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminSubscriptionPlanService)),
    __metadata("design:paramtypes", [Object])
], AdminSubscriptionPlanController);
