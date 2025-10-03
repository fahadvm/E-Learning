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
exports.AdminSubscriptionPlanService = void 0;
// src/services/admin/SubscriptionPlanService.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const Admin_subscriptionPlan_Dto_1 = require("../../core/dtos/admin/Admin.subscriptionPlan.Dto");
let AdminSubscriptionPlanService = class AdminSubscriptionPlanService {
    constructor(_planRepo) {
        this._planRepo = _planRepo;
    }
    createPlan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._planRepo.create(data);
            return (0, Admin_subscriptionPlan_Dto_1.adminSubscriptionPlanDto)(plan);
        });
    }
    getAllPlans(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            page = page || 1;
            limit = limit || 10;
            if (page < 1 || limit < 1) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.PAGE_OUT_OF_RANGE, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const skip = (page - 1) * limit;
            const plans = yield this._planRepo.findAll(skip, limit, search);
            const total = yield this._planRepo.countAll(search);
            const totalPages = Math.ceil(total / limit);
            return {
                plans: plans.map(Admin_subscriptionPlan_Dto_1.adminSubscriptionPlanDto),
                total,
                totalPages
            };
        });
    }
    getPlanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._planRepo.getById(id);
            if (!plan)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_subscriptionPlan_Dto_1.adminSubscriptionPlanDto)(plan);
        });
    }
    updatePlan(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id, data, ' these are the resources');
            const updated = yield this._planRepo.update(id, data);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_subscriptionPlan_Dto_1.adminSubscriptionPlanDto)(updated);
        });
    }
    deletePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._planRepo.getById(id);
            if (!plan)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this._planRepo.delete(id);
        });
    }
    getAllForStudent() {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield this._planRepo.findAllForStudents();
            return plans.map(Admin_subscriptionPlan_Dto_1.adminSubscriptionPlanDto);
        });
    }
    getAllForCompany() {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield this._planRepo.findAllForCompany();
            return plans.map(Admin_subscriptionPlan_Dto_1.adminSubscriptionPlanDto);
        });
    }
};
exports.AdminSubscriptionPlanService = AdminSubscriptionPlanService;
exports.AdminSubscriptionPlanService = AdminSubscriptionPlanService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object])
], AdminSubscriptionPlanService);
