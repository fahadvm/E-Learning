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
exports.TeacherPayoutService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const Payout_1 = require("../../models/Payout");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const mongoose_1 = require("mongoose");
let TeacherPayoutService = class TeacherPayoutService {
    constructor(_payoutRepo, _walletRepo, _transactionRepo) {
        this._payoutRepo = _payoutRepo;
        this._walletRepo = _walletRepo;
        this._transactionRepo = _transactionRepo;
    }
    requestPayout(teacherId, amount, method, details) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0)
                (0, ResANDError_1.throwError)("Invalid amount", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            // 1. Deduct Balance (Atomic)
            // This will throw if insufficient funds
            yield this._walletRepo.deductBalance(teacherId, amount);
            try {
                // 2. Create Payout Request
                const payout = yield this._payoutRepo.create({
                    teacherId: new mongoose_1.Types.ObjectId(teacherId),
                    amount,
                    method,
                    details,
                    status: Payout_1.PayoutStatus.PENDING,
                });
                // 3. Create Pending Transaction Record (Optional, but good for audit)
                yield this._transactionRepo.create({
                    teacherId: new mongoose_1.Types.ObjectId(teacherId),
                    amount: amount,
                    grossAmount: amount, // For withdrawal, gross = net
                    type: "TEACHER_WITHDRAWAL",
                    txnNature: "DEBIT",
                    paymentStatus: "PENDING",
                    paymentMethod: "MANUAL", // or WALLET mapping
                    description: `Payout Request ${payout._id}`
                });
                return payout;
            }
            catch (error) {
                // Rollback: Refund balance if payout creation fails
                yield this._walletRepo.refundBalance(teacherId, amount);
                throw error;
            }
        });
    }
    getPayoutHistory(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._payoutRepo.findAll({ teacherId });
        });
    }
    getWalletStats(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this._walletRepo.findByTeacherId(teacherId);
            if (!wallet)
                return { balance: 0, totalEarned: 0, totalWithdrawn: 0 };
            return {
                balance: wallet.balance,
                totalEarned: wallet.totalEarned,
                totalWithdrawn: wallet.totalWithdrawn,
            };
        });
    }
};
exports.TeacherPayoutService = TeacherPayoutService;
exports.TeacherPayoutService = TeacherPayoutService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PayoutRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.WalletRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.TransactionRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], TeacherPayoutService);
