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
exports.TransactionAdminService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
let TransactionAdminService = class TransactionAdminService {
    constructor(_transactionRepo) {
        this._transactionRepo = _transactionRepo;
    }
    getAllTransactions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search, startDate, endDate, status, } = query;
            const filter = {};
            if (status) {
                filter.paymentStatus = status;
            }
            if (startDate || endDate) {
                filter.createdAt = {};
                if (startDate)
                    filter.createdAt.$gte = new Date(startDate);
                if (endDate)
                    filter.createdAt.$lte = new Date(endDate);
            }
            if (search) {
                const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
                if (isObjectId) {
                    filter._id = search;
                }
            }
            const sort = { createdAt: -1 };
            const skip = (Number(page) - 1) * Number(limit);
            const limitNum = Number(limit);
            const transactions = yield this._transactionRepo.findWithPopulation(filter, {
                skip,
                limit: limitNum,
                sort
            }, [
                { path: 'userId', select: 'name email avatar' },
                { path: 'teacherId', select: 'name email avatar' },
                { path: 'companyId', select: 'name email logo' },
                { path: 'courseId', select: 'title' }
            ]);
            const total = yield this._transactionRepo.count(filter);
            return {
                transactions,
                total,
                page: Number(page),
                totalPages: Math.ceil(total / limitNum)
            };
        });
    }
};
exports.TransactionAdminService = TransactionAdminService;
exports.TransactionAdminService = TransactionAdminService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TransactionRepository)),
    __metadata("design:paramtypes", [Object])
], TransactionAdminService);
